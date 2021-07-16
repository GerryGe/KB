---
title: C# Async 反模式
date: 2021-03-29
tags:
 - .NET
categories:
 - .NET
sidebar: 'auto'
sticky: 1
---

`async`和`await`这两个关键字在简化用C＃编写异步代码方面做得很好，但是不幸的是，它们不能神奇地保护您免于出错。

在本文中，我想强调一些我在代码审查中遇到的最常见的异步编码错误或反模式。

## 1. 被遗忘的await

每当调用返回`Task`或`Task<T>` 的方法时，您都不应改忽略其返回值。在大多数情况下，这意味着等待它，尽管有时您可能会保留该`Task`以待稍后等待。

在此示例中，我们调用`Task.Delay`，但是因为我们不等待它，所以将立即写入 “After” 消息，因为`Task.Delay(1000)`只是返回了将在一秒钟内完成的任务，但是没有任何等待

该任务完成。

```csharp
Console.WriteLine("Before");
Task.Delay(1000);
Console.WriteLine("After");
```

如果您在返回`Task`并用`async`关键字标记的方法中犯了此错误，则编译器将为您提供有用的错误：

> 因为不等待此调用，所以在调用完成之前将继续执行当前方法。
> 
> 考虑将`await`运算符应用于调用结果。

但是在未标记为`async`的同步方法或任务返回方法中，C＃编译器似乎很乐​​于让您执行此操作，因此请保持警惕，不要让这个错误被忽略。

## 2. 忽略 tasks

有时，开发人员会故意忽略异步方法的结果，因为他们明确地不想等待其完成。

也许这是一个长期运行的操作，他们希望在进行其他工作时在后台进行。

所以有时候我看到这样的代码：

```csharp
// 在后台运行 - 我们不想等待它执行完成
var ignoredTask = DoSomethingAsync();
```

这种方法的危险在于，没有什么东西可以捕获DoSomethingAsync引发的任何异常。

充其量，这意味着您不知道它没有完成。

最糟糕的是，[它可能会终止您的过程](https://docs.microsoft.com/zh-cn/dotnet/standard/threading/exceptions-in-managed-threads)

因此，请谨慎使用此方法，并确保该方法具有良好的异常处理。

通常，当我在云应用程序中看到这样的代码时，我经常对其进行重构，以将消息发布到队列，该队列的消息处理程序执行后台操作。

## 3. 使用async void方法

有时您会发现自己处于同步方法中（即不返回`Task`或`Task<T>`的方法），但您想调用异步方法。但是，如果不将方法标记为异步，则不能使用await关键字。

开发人员可以通过两种方法来解决这个问题，并且都有风险。

首先当您使用`void`方法时，C＃编译器将允许您添加`async`关键字。

这使我们可以使用`await`关键字：

```csharp
public async void MyMethod()
{
    await DoSomethingAsync();
}
```

问题是`MyMethod`的*调用者*无法等待此方法的结果。他们无权访问`DoSomethingAsync`返回的任务。因此，您实际上再次忽略了一项任务。

现在有一些场景是可以使用`async void`方法的。最好的示例是在Windows Forms或WPF应用程序中的事件处理程序中。事件处理程序的方法签名返回`void`，因此您不能使它们返回`Task`。

因此，看到这样的代码不一定是一个问题：

```csharp
public async void OnButton1Clicked(object sender, EventArgs args)
{
    await LoadDataAsync();
    // TODO 更新UI
}
```

但是在大多数情况下，我建议不要使用`async void`。如果可以使方法返回`Task`，则应这样做。

## 4. 使用.Result或.Wait阻止任务

开发人员解决从同步方法调用异步方法的难题的另一种常见方法是在`Task`上使用`.Result`属性或`.Wait`方法。 

`.Result`属性等待`Task`完成，然后返回其结果，这乍一看似乎非常有用。

我们可以这样使用它：

```csharp
public void SomeMethod()
{
    var customer = GetCustomerByIdAsync(123).Result;
}
```

但是这里有一些问题。首先是使用诸如`Result`之类的阻塞调用将可能正在做其他有用工作的线程捆绑在一起。更严重的是，将异步代码与对`.Result`（或`.Wait()`）的调用混合在一起，为某些[真正令人讨厌的死锁](https://blog.stephencleary.com/2012/07/dont-block-on-async-code.html)问题打开了大门。



通常，每当需要调用异步方法时，都应使该方法处于异步状态。是的，它需要一些工作，有时会导致许多级联的更改，这些更改在大型的旧版代码库中可能很烦人，但通常比引入死锁的风险更可取。



在某些情况下，您可能无法使该方法异步。例如，如果要在类构造函数中进行异步调用-这是不可能的。但是，经常有一些想法，您可以重新设计该类以使其不需要。



例如，代替此：

```csharp
class CustomerHelper
{
    private readonly Customer customer;
    public CustomerHelper(Guid customerId, ICustomerRepository customerRepository) 
    {
        customer = customerRepository.GetAsync(customerId).Result; // 慎用!
    }
}
```

您可以通过使用异步工厂方法来构建类来执行以下操作：

```csharp
class CustomerHelper
{
    public static async Task<CustomerHelper> CreateAsync(Guid customerId, ICustomerRepository customerRepository)
    {
        var customer = await customerRepository.GetAsync(customerId);
        return new CustomerHelper(customer)
    }

    private readonly Customer customer;
    private CustomerHelper(Customer customer) 
    {
        this.customer = customer;
    }
}
```

其他情况是在实现同步的且无法更改的第三方接口时。我遇到了`IDispose`并实现了ASP.NET MVC的`ActionFilterAttribute`。在这些情况下，您要么必须很有创造力，要么只能接受需要引入阻塞调用，并准备在其他位置编写很多`ConfigureAwait(false)`调用以防止死锁（稍后会详细介绍）。



好消息是，随着现代C＃开发的发展，您需要阻止任务变得越来越稀有。从C＃7.1开始，您可以为控制台应用程序声明[`async Main`](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-7)方法，并且ASP.NET Core比以前的ASP.NET MVC更异步友好，这意味着您很少会遇到这种情况。



## 5. 在async方法中混用 ForEach

`List<T>` 类具有一个称为`ForEach`的“方便”方法，该方法对列表中的每个元素执行`Action<T>` 。如果您看过我的LINQ谈话中的任何内容，您会知道我对这种方法的疑虑，因为它会鼓励各种不良做法（出于避免`ForEach`的某些原因，[请阅读此内容](https://docs.microsoft.com/zh-cn/archive/blogs/ericlippert/foreach-vs-foreach)）。

但是我看到的一种常见的与线程相关的滥用，是使用ForEach调用异步方法。

例如，假设我们要像这样向所有客户发送电子邮件：

```csharp
customers.ForEach(c => SendEmailAsync(c));
```

这里有什么问题呢？好吧，我们所做的与编写以下foreach循环完全相同：

```csharp
foreach(var c in customers)
{
    SendEmailAsync(c); // the return task is ignored
}
```

我们为每个客户生成了一个任务，但没有等待它们中的任何一个完成。

有时，我会看到开发人员尝试通过在lambda中添加async和await关键字来解决此问题：

```csharp
customers.ForEach(async c => await SendEmailAsync(c));
```

但这没什么区别。 `ForEach`方法接受`Action<T>`，该操作返回`void`。因此，您实质上已经创建了一个异步void方法，该方法当然是我们以前的反模式之一，因为调用者无法等待它。

那么，解决办法是什么？好吧，就我个人而言，我通常更喜欢将其替换为更明确的`foreach`循环：

```csharp
foreach(var c in customers)
{
    await SendEmailAsync(c);
}
```

某些人更喜欢将其变成一种扩展方法，称为`ForEachAsync`之类的方法，它允许您编写如下所示的代码：

```csharp
await customers.ForEachAsync(async c => await SendEmailAsync(c));
```

但是不要将`List<T>.ForEach`（或者实际上是具有完全相同问题的`Parallel.ForEach`）与异步方法混合使用。



## 6. 过多的并行化

有时，开发人员会将顺序执行的一系列任务标识为性能瓶颈。例如，下面的代码按顺序处理一些订单：

```csharp
foreach(var o in orders)
{
    await ProcessOrderAsync(o);
}
```

有时，我会看到开发人员尝试通过以下方法来加快速度：

```csharp
var tasks = orders.Select(o => ProcessOrderAsync(o)).ToList();
await Task.WhenAll(tasks);
```

我们在这里所做的是为每个订单调用`ProcessOrderAsync`方法，并将每个产生的Task存储在列表中。然后，我们等待所有任务完成。现在，这是“有效的”，但是如果有10,000个订单怎么办？我们已经在线程池中充斥了成千上万的任务，有可能阻止其他有用的工作完成。

如果`ProcessOrderAsync`对另一个服务（如数据库或微服务）进行下游调用，则可能由于调用数量过多而使该服务超载。



这里正确的方法是什么？至少我们可以考虑限制一次可以调用`ProcessOrderAsync`的并发线程的数量。我在这里写了[几种不同的方法](https://markheath.net/post/constraining-concurrent-threads-csharp)来实现这一目标。



如果我在分布式云应用程序中看到这样的代码，通常表明我们应该引入一些消息传递，以便可以将工作负载分为多个批处理并由多个服务器处理。



## 7. 非线程安全的副作用

如果您曾经研究过函数式编程（即使您没有计划切换语言，我也建议您这样做），您会遇到“纯”函数的想法。 “纯”功能的想法是它没有副作用。它接收数据，并返回数据，但不改变任何东西。纯函数带来许多好处，包括固有的线程安全性。

我经常看到这样的异步方法，在该方法中我们已经传递了列表或字典，并在方法中对其进行了修改：

```csharp
public async Task ProcessUserAsync(Guid id, List<User> users)
{
    var user = await userRepository.GetAsync(id);
    // do other stuff with the user
    users.Add(user);
}
```

麻烦的是，此代码具有风险，因为在同一时间在不同线程上修改`users`列表不是线程安全的。

下面是更新的相同方法，因此它不再对用户列表产生副作用。

```csharp
public async Task<User> ProcessUserAsync(Guid id)
{
    var user = await userRepository.GetAsync(id);
    // do other stuff with the user
    return user;
}
```

现在，我们已经将将用户添加到列表中的责任移到了此方法的调用者上，后者有更大的机会确保仅从​​一个线程访问列表。



## 8. 缺少ConfigureAwait(false)

对于新开发人员来说，`ConfigureAwait`不是一个特别容易理解的概念，但它是一个重要的概念，如果您发现自己在使用`.Result`和`.Wait`的代码库上工作，正确使用它可能至关重要。

我不会详细介绍，但是从本质上来说，`ConfigureAwait(true)`的**含义是**，*我希望代码在等待完成后继续在相同的“同步上下文”上继续执行*。例如，在WPF应用程序中，“[同步上下文](https://docs.microsoft.com/en-us/archive/msdn-magazine/2011/february/msdn-magazine-parallel-computing-it-s-all-about-the-synchronizationcontext)”是UI线程，而我只能从该线程对UI组件进行更新。因此，我几乎总是希望在我的UI代码中使用`ConfigureAwait(true)`。

```csharp
private async void OnButtonClicked() 
{
    var data = await File.ReadAllBytesAsync().ConfigureAwait(true);
    this.textBoxFileSize.Text = $"The file is ${data.Length} bytes long"; // needs to be on the UI thread
}
```

现在，`ConfigureAwait(true)`实际上是默认值，因此我们可以放心地把它从上面的示例中移除，并且一切仍然可以正常工作。



但是为什么我们要使用`ConfigureAwait(false)`？好吧，出于性能原因。并非所有内容都需要在“同步上下文”上运行，因此，如果我们不让一个线程来完成所有工作，那就更好了。因此，只要我们不在乎继续在哪个线程上运行，就应该使用`ConfigureAwait(false)`，切换线程实际上是很耗时的，尤其是在处理文件和网络调用的低级代码中。



但是，当我们开始合并具有同步上下文的代码`ConfigureAwait(false)`并调用`.Result`时，确实存在死锁的危险。因此，避免这种情况的推荐方法是记住不要在不需要显式停留在同步上下文上的*任何地方*调用`ConfigureAwait(false)`。

例如，如果您创建了一个通用的NuGet库，则强烈建议在每个单独的await调用中放置`ConfigureAwait(false)`，因为您不能确定将在哪个上下文中使用它。



即将出现一些好消息。[在ASP.NET Core中，不再有同步上下文](https://blog.stephencleary.com/2017/03/aspnetcore-synchronization-context.html)，这意味着您不再需要将对`ConfigureAwait(false)`的调用放入其中。尽管如此，在创建NuGet程序包时仍然建议这样做。



但是，如果您的项目正在存在死锁风险中，则需要非常警惕在各处添加`ConfigureAwait(false)`调用。



## 9. 忽略async的版本

每当.NET框架中的方法花费一些时间或执行一些磁盘或网络IO时，几乎总是可以使用该方法的异步版本来代替。不幸的是，出于向后兼容的原因，保留了同步版本。但是，不再有使用它们的充分理由。



因此例如，`Task.Delay`优先于`Thread.Sleep`，`dbContext.SaveChangesAsync`优先于`dbContext.SaveChanges`，将`fileStream.ReadAsync`优先于`fileStream.Read`。这些更改释放了线程池线程来执行其他更有用的工作，从而使您的程序可以处理更多的请求。



## 10.  try catch没有await

您可能会知道有一个方便的优化方法。假设我们有一个非常简单的异步方法，该方法的最后一行仅发出一个异步调用：

```csharp
public async Task SendUserLoggedInMessage(Guid userId)
{
    var userLoggedInMessage = new UserLoggedInMessage() { UserId = userId };
    await messageSender.SendAsync("mytopic", userLoggedInMessage);
}
```

在这种情况下，无需使用async和await关键字。我们可以简单地完成以下操作，然后直接返回任务：

```csharp
public Task SendUserLoggedInMessage(Guid userId)
{
    var userLoggedInMessage = new UserLoggedInMessage() { UserId = userId };
    return messageSender.SendAsync("mytopic", userLoggedInMessage);
}
```

在幕后，这会生成效率更高的代码，因为使用await关键字的代码会在后台编译为状态机。

但让我们假设我们将函数更新为如下所示：

```csharp
public Task SendUserLoggedInMessage(Guid userId)
{
    var userLoggedInMessage = new UserLoggedInMessage() { UserId = userId };
    try
    {
        return messageSender.SendAsync("mytopic", userLoggedInMessage);
    }
    catch (Exception ex)
    {
        logger.Error(ex, "Failed to send message");
        throw;
    }
}
```

看起来很安全，但是`catch`子句实际上不会达到您期望的效果。它不会捕获从`SendAsync`返回的任务运行时可能引发的所有异常。那是因为我们只捕获了创建该`Task`时抛出的异常。如果我们想捕获在任务执行过程中随时抛出的异常，则需要再次使用`await`关键字：

```csharp
public async Task SendUserLoggedInMessage(Guid userId)
{
    var userLoggedInMessage = new UserLoggedInMessage() { UserId = userId };
    try
    {
        await messageSender.SendAsync("mytopic", userLoggedInMessage);
    }
    catch (Exception ex)
    {
        logger.Error(ex, "Failed to send message");
        throw;
    }
}
```

现在，我们的`catch`块将能够捕获在`SendAsync`任务执行过程中任何时候抛出的异常。



## 总结

有很多方法可以导致异步代码出现问题，因此值得花费时间来加深对线程的理解。在本文中，我选择了一些我最常看到的问题，但是我敢肯定还有很多可以添加的问题。在评论中让我知道您将添加到此列表的建议。



如果您想了解有关C＃线程的更多信息，我可以推荐的一些资源是Bill Wagner最近在NDC上发表的演讲： [The promise of an async future awaits](https://www.youtube.com/watch?v=ghDS4_NFbcQ)，Filip Ekberg的Pluralsight课程“ [Getting Started with Asynchronous Programming in .NET](https://www.pluralsight.com/courses/asynchronous-programming-dotnet-getting-started)”，当然还有其他由著名的异步专家[Stephen Cleary](https://blog.stephencleary.com/)撰写的内容。



> 原文：[C# Async Antipatterns](https://markheath.net/post/async-antipatterns)

