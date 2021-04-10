---
title: Asp.Net Core依赖注入最佳实践和秘诀
date: 2021-04-10
tags:
 - C#
categories:
 - .NET
sidebar: 'auto'
sticky: 1
author: gerryge
---


在本文中，我将分享我在ASP.NET Core应用程序中使用依赖注入的经验和建议。

这些原则背后的动机是：
- 有效地设计服务及其依赖项。
- 防止多线程问题。
- 防止内存泄漏。
- 防止潜在的错误。

本文假定您已经基本熟悉了依赖注入和ASP.NET Core。如果没有，请首先阅读[ASP.NET Core Dependency Injection](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-5.0)文档。

## 基础

#### 构造函数注入（Constructor Injection）

构造函数注入用于声明和获取服务对服务构造的依赖关系。

例如：

```c#
public class ProductService
{
    private readonly IProductRepository _productRepository;   
    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }    

    public void Delete(int id)
    {
        _productRepository.Delete(id);
    }
}
```

`ProductService`会将`IProductRepository`作为依赖项注入其构造函数中，然后在`Delete`方法中使用它。

**最佳实践：**

- 在服务构造函数中显式定义所需的依赖项。因此，如果没有依赖项，就无法构建服务。
- 将注入的依赖项分配给只读字段/属性（以防止在方法内部意外为其分配另一个值）。

#### 属性注入（Property Injection）

ASP.NET Core的[标准依赖项注入容器](https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection)不支持属性注入。但是[您可以使用](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-5.0)另一个支持属性注入的容器。

例如：

```csharp
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace MyApp
{
    public class ProductService
    {
        public ILogger<ProductService> Logger { get; set; }   
        private readonly IProductRepository _productRepository;  
 
        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;     
            Logger = NullLogger<ProductService>.Instance;
        }

        public void Delete(int id)
        {
            _productRepository.Delete(id);  
            Logger.LogInformation($"Deleted a product with id = {id}");
        }
    }
}
```

ProductService正在使用公共设置器声明Logger属性。依赖项注入容器在可用的情况下（之前已注册到DI容器）可以设置Logger。

**最佳实践：**

- 仅将属性注入用于可选依赖项。这意味着在不提供这些依赖项的情况下，您的服务可以正常工作。
- 如果可能，请使用[Null Object Pattern](https://en.wikipedia.org/wiki/Null_object_pattern)（如本示例中所示）。否则，请在使用依赖项时始终检查是否为null。

### 服务定位器（Service Locator）

服务定位器模式是获得依赖关系的另一种方法。例如：
```csharp
public class ProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ILogger<ProductService> _logger; 

    public ProductService(IServiceProvider serviceProvider)
    {
        _productRepository = serviceProvider
          .GetRequiredService<IProductRepository>();        
        _logger = serviceProvider
          .GetService<ILogger<ProductService>>() ??
            NullLogger<ProductService>.Instance;
    }    

    public void Delete(int id)
    {
        _productRepository.Delete(id);
        _logger.LogInformation($"Deleted a product with id = {id}");
    }
}

```

`ProductService`正在注入`IServiceProvider`并使用它来解决依赖关系。如果之前未注册请求的依赖项，则`GetRequiredService`会引发异常。另一方面，在这种情况下，`GetService`仅返回null。

当您在构造函数中解析服务时，将在发布服务时将其释放。因此，在构造函数内部解析的服务您不必担心释放(releasing/disposing)（就像构造函数和属性注入一样）。

**最佳实践：**

- 尽可能不要使用服务定位器模式（如果在开发时知道服务类型）。因为它使依赖关系隐式化。这意味着在创建服务实例时不可能轻易看到依赖关系。这对于单元测试尤其重要，在单元测试中，您可能希望模拟服务的某些依赖关系。
- 如果可能请尽量在服务构造函数中解析依赖关系。解析在服务方法中会使您的应用程序更加复杂且容易出错。我将在下一部分中介绍问题和解决方案。

### 服务生命周期

ASP.NET Core依赖注入中有[三个服务生周期](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-5.0#service-lifetimes)：

1. **Transient** - 每次注入或请求时都会创建*瞬时服务*。
2. **Scoped** - *范围服务*是按范围创建的。在Web应用程序中，每个Web请求都会创建一个新的单独的服务范围。这意味着通常会根据Web请求创建范围服务。
3. **Singleton** - 每个DI容器都会创建*单例服务*。通常，这意味着每个应用程序只能创建一次，然后在整个应用程序生命周期中使用它们。

DI容器跟踪所有已解析的服务。服务在生命周期结束时被释放：

- 如果服务具有依赖项，则它们也将被自动释放和处置。
- 如果服务实现`IDisposable`接口，则在服务释放（service release）时会自动调用Dispose方法。


**最佳实践：**

- 尽可能将您的服务注册为瞬时服务。因为设计瞬时服务很简单。您通常不关心多线程和内存泄漏，并且知道该服务的寿命很短。
- 谨慎使用范围服务的生命周期，因为如果您创建子服务范围或从非Web应用程序使用这些服务，可能会很棘手。
- 请谨慎使用单例生存期，因为这样您就需要处理多线程和潜在的内存泄漏问题。
- 不要在单例服务中依赖瞬时或范围服务。因为瞬时服务在单例服务注入时成为一个单例实例，并且如果瞬时服务未设计为支持这种情况，则可能会导致问题。在这种情况下，ASP.NET Core的默认DI容器已经引发异常。

### 在方法中解析服务

在某些情况下，您可能需要在一个服务的方法内部来解析另外一个服务在这种情况下，请确保在使用后释放服务。确保这一点的最佳方法是创建服务范围。

例如：
```csharp
public class PriceCalculator
{
    private readonly IServiceProvider _serviceProvider;
  
    public PriceCalculator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }    

    public float Calculate(Product product, int count,
      Type taxStrategyServiceType)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var taxStrategy = (ITaxStrategy)scope.ServiceProvider
              .GetRequiredService(taxStrategyServiceType);
            var price = product.Price * count;
            return price + taxStrategy.CalculateTax(price);
        }
    }
}
```

`PriceCalculator`将`IServiceProvider`注入其构造函数中，并将其分配给字段。然后，`PriceCalculator`在`Calculate`方法中使用它来创建子服务范围。它使用`scope.ServiceProvider`来解析服务，而不是使用`_serviceProvider`实例。因此，从范围解析的所有服务都会在using语句的末尾自动释放/处置。

**最佳实践：**

- 如果要在方法中解析服务，请始终创建子服务范围以确保正确释放已解析的服务。
- 如果方法以`IServiceProvider`作为参数，则可以直接从中解析服务，而无需考虑释放/处置。创建/管理服务范围是调用您方法的调用者的责任。遵循此原则可使您的代码更干净。
- 不要保留对已解析服务的引用！否则，可能会导致内存泄漏，并且稍后在使用对象引用时（除非已解析的服务为单例），您将访问已释放的服务。

### 单例服务

单例服务通常设计为保持应用程序状态。缓存是应用程序状态的一个很好的例子。例如：
```csharp
public class FileService
{
    private readonly ConcurrentDictionary<string, byte[]> _cache;
  
    public FileService()
    {
        _cache = new ConcurrentDictionary<string, byte[]>();
    }    

    public byte[] GetFileContent(string filePath)
    {
        return _cache.GetOrAdd(filePath, _ =>
        {
            return File.ReadAllBytes(filePath);
        });
    }
}
```
`FileService`只是缓存文件内容以减少磁盘读取。该服务应注册为单例。否则，缓存将无法按预期工作。

**最佳实践：**

- 如果服务保持状态，则应以线程安全的方式访问该状态。因为所有请求同时使用服务的同一实例。我使用`ConcurrentDictionary`而不是`Dictionary`来确保线程安全。
- 不要在单例服务中使用范围或瞬时服务。因为，瞬时服务可能没有被设计为线程安全的。如果必须使用它们，则在使用这些服务时要注意多线程（例如使用锁）。
- 内存泄漏通常是由单例服务引起的。在应用程序结束之前，它们不会被释放/处置。因此，如果它们实例化类（或注入）但不释放/处置它们，它们也将保留在内存中，直到应用程序结束。确保在正确的时间释放/处置它们。请参阅上方“[在方法中解析服务](#在方法中解析服务)”章节。
- 如果缓存数据（在此示例中为文件内容），则应创建一种机制，以在原始数据源发生更改时（在此示例中，当磁盘上的缓存文件发生更改时）更新/使缓存的数据无效。

### 范围服务

范围的生命周期首先似乎是存储每个Web请求数据的理想选择。因为ASP.NET Core会为每个Web请求创建一个服务范围。因此，如果您将服务注册为范围，则可以在Web请求期间共享该服务。例如：
```csharp
public class RequestItemsService
{
    private readonly Dictionary<string, object> _items;  

    public RequestItemsService()
    {
        _items = new Dictionary<string, object>();
    }    

    public void Set(string name, object value)
    {
        _items[name] = value;
    }    

    public object Get(string name)
    {
        return _items[name];
    }
}
```
如果将`RequestItemsService`注册为范围服务并将其注入到两个不同的服务中，则可以获得从另一个服务添加的项目，因为它们将共享相同的`RequestItemsService`实例。这就是我们对范围服务的期望。

但是事实可能并不总是那样。如果创建子服务作用域并从子作用域解析`RequestItemsService`，则将获得`RequestItemsService`的新实例，它将无法按预期工作。因此，范围服务并不总是意味着一个Web请求一个实例。

您可能会认为您没有犯这样明显的错误（解决了子作用域内的作用域）。但是，这不是一个错误（非常常规的用法），情况可能并非如此简单。如果您的服务之间存在较大的依赖关系图，则您将无法确定是否有人创建了子作用域并解析了注入另一个服务的服务……最终注入了范围服务。

**最佳实践：**

- 范围服务可以被认为是一种优化，它是由Web请求中的太多服务注入的。因此，所有这些服务将在同一Web请求期间使用该服务的单个实例。
- 范围服务不必设计为线程安全的。因为，它们通常应由单个Web请求/线程使用。但是，即使那样，您不应该在不同线程之间共享服务范围！
- 如果您设计范围内的服务以在Web请求中的其他服务之间共享数据，请小心（如上所述）。您可以将每个Web请求的数据存储在`HttpContext`内部（注入`IHttpContextAccessor`进行访问），这是更安全的方法。 `HttpContext`的生存期不受限制。实际上，它根本没有注册到DI（这就是为什么您不注入它，而是注入`IHttpContextAccessor`的原因）。 [`HttpContextAccessor`](https://github.com/aspnet/HttpAbstractions/blob/master/src/Microsoft.AspNetCore.Http/HttpContextAccessor.cs)实现使用`AsyncLocal`在Web请求期间共享相同的`HttpContext`。

### 总结

依赖注入一开始似乎很容易使用，但是如果您不遵循某些严格的原则，则可能存在多线程和内存泄漏的问题。


> 原文：[AspNet Core Dependency Injection Best Practices & Tips](https://volosoft.com/blog/ASP.NET-Core-Dependency-Injection-Best-Practices,-Tips-Tricks)