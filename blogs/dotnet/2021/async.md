---
title: C# Async 反模式
date: 2021-03-29
tags:
 - C#
categories:
 - .NET
sidebar: 'auto'
sticky: 1
author: gerryge
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

最糟糕的是，[它可能会终止您的过程]([托管线程中的异常 | Microsoft Docs](https://docs.microsoft.com/zh-cn/dotnet/standard/threading/exceptions-in-managed-threads))

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

未完待续。。。


