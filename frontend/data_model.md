# Data models
---


## User
```js
    {
      id: String,
      image: String,
      name: String,
      place: Number,
    }
```

## Place
```js
    {
        id: String,
        image: String,
        title: String,
        description: String,
        address: String,
        creator: String,
        location: {
            lat: Number,
            lng: Number,
        },
    }
```