# todo
## 1
```ts
export type Product = {
  readonly id: string;
  readonly name: string;
  readonly status: "A" | "I";
};

export function Product(product: Product) {
  function isActive() {
    return product.status === "A";
  }

  function updateToInactive(status: "A" | "I") {
    const newProduct: Product = { ...product, status: status };
    return newProduct;
  }

  return {
    isActive,
    updateToInactive
  };
}
```

## 2
use fp-either

## 3

use export in the end of the file
```ts
type User = {
  readonly name: string
  readonly birthDate: number
}

function User(user: User) {
  function sayHello() {
    return `Hello ${user.name}`
  }

  function age(now: Date) {
    return now - user.birthDate
  }

  return {
    sayHello,
    age,
  }
}

export { User }
```

## 4
from user.typing.ts to user-typing.ts

## 5
export things as clear as possible. I can use UserStatus instead of Status because I already use UserEntity,
why not UserStatus?

## 6
I think would be better if I change from function to const

## 7
maybe use pino js

## 8
make token required, not optional
```ts
function findLoggedInUser(token: string) {
  // ...
}
```
## 9
maybe I can let all things in the same level
ex:
- src
  - models
  - repositories
  - controllers

I can define the type and the implementation in the same file
ex:
```ts
type UserRepository = {
  create: (user: User) => Promise<User>
}

const UserRepository = (userEntity: UserEntity): UserRepository => {
  const create = async (user: User) => {
    const userDb = userEntity.toDb()
    const persistedUser = await prisma.user.create({
      data: userDb,
    })
    const createdUserEntity = userEntity.fromDb(persistedUser)
    return createdUserEntity
  }

  return {
    create
  }
}

export { UserRepository }
```

## 10
use the return type to directly return things
ex:
```ts
const toJson = (vehicle: Vehicle): VehicleJson => ({
  id: vehicle.id,
  model: vehicle.model
})
```

## 11
add space between things
ex:
```ts
const roles = [ ...oldRoles, newRole ]
const user = { name: "name" }
const sayHello = ( name: string ) => `Hello ${name}`
const updatedRoles = roles.map( ( role ) => `${role} is cool` )
```
