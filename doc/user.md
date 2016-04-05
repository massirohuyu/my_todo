## <a name="resource-user">User</a>

Stability: `prototype`

User API

### Attributes

| Name | Type | Description | Example |
| ------- | ------- | ------- | ------- |
| **created_at** | *date-time* | when user was created | `"2015-01-01T12:00:00Z"` |
| **id** | *uuid* | unique identifier of user | `1` |
| **name** | *string* | unique name of user | `"example"` |
| **updated_at** | *date-time* | when user was updated | `"2015-01-01T12:00:00Z"` |

### User Create

Create a new user.

```
POST /users
```


#### Curl Example

```bash
$ curl -n -X POST /users \
  -d '{
}' \
  -H "Content-Type: application/json"
```


#### Response Example

```
HTTP/1.1 201 Created
```

```json
{
  "created_at": "2015-01-01T12:00:00Z",
  "id": 1,
  "name": "example",
  "updated_at": "2015-01-01T12:00:00Z"
}
```

### User Delete

Delete an existing user.

```
DELETE /users/{user_id_or_name}
```


#### Curl Example

```bash
$ curl -n -X DELETE /users/$USER_ID_OR_NAME \
  -H "Content-Type: application/json"
```


#### Response Example

```
HTTP/1.1 200 OK
```

```json
{
  "created_at": "2015-01-01T12:00:00Z",
  "id": 1,
  "name": "example",
  "updated_at": "2015-01-01T12:00:00Z"
}
```

### User Info

Info for existing user.

```
GET /users/{user_id_or_name}
```


#### Curl Example

```bash
$ curl -n /users/$USER_ID_OR_NAME
```


#### Response Example

```
HTTP/1.1 200 OK
```

```json
{
  "created_at": "2015-01-01T12:00:00Z",
  "id": 1,
  "name": "example",
  "updated_at": "2015-01-01T12:00:00Z"
}
```

### User List

List existing users.

```
GET /users
```


#### Curl Example

```bash
$ curl -n /users
```


#### Response Example

```
HTTP/1.1 200 OK
```

```json
[
  {
    "created_at": "2015-01-01T12:00:00Z",
    "id": 1,
    "name": "example",
    "updated_at": "2015-01-01T12:00:00Z"
  }
]
```

### User Update

Update an existing user.

```
PATCH /users/{user_id_or_name}
```


#### Curl Example

```bash
$ curl -n -X PATCH /users/$USER_ID_OR_NAME \
  -d '{
}' \
  -H "Content-Type: application/json"
```


#### Response Example

```
HTTP/1.1 200 OK
```

```json
{
  "created_at": "2015-01-01T12:00:00Z",
  "id": 1,
  "name": "example",
  "updated_at": "2015-01-01T12:00:00Z"
}
```


