// function getResult(status) {
//   if (status === 0) {
//     return 'offline';
//   } else if (status === 1) {
//     return 'online';
//   }
//   else if (status === 2) {
//     return 'deleted';
//   }
//   return 'error';
// }

// const Status = {
//   OFFLINE: 0,
//   ONLINE: 1,
//   DELETED: 2
// }

enum Status {
  OFFLINE,
  ONLINE = 4,
  DELETED
}
// console.log(Status.OFFLINE);
// console.log(Status.ONLINE);
// console.log(Status.DELETED);

// console.log(Status[0]);
// console.log(Status[4]);
// console.log(Status[5]);

function getResult(status) {
  if (status === Status.OFFLINE) {
    return 'offline';
  } else if (status === Status.ONLINE) {
    return 'online';
  }
  else if (status === Status.DELETED) {
    return 'deleted';
  }
  return 'error';
}

const result = getResult(0);
//const result = getResult(Status.ONLINE);
console.log(result);