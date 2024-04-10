# Examples for Testing Backend in Postman

To test the backend endpoints in Postman, you can use the following JSON examples.

## Creating a custom exercise

```json
{
  "name": "custom",
  "muscle_group": "arms",
  "difficulty_level": "hard",
  "equipment": "machine",
  "bodyweight": false,
  "isolation_vs_compound": "isolation",
  "range_of_motion": "full"
}
```

## Creating a routine

```json
{
  "name": "routine1",
  "exercises": [
    {
      "name": "Pull-ups",
      "sets": [
        {
          "reps": "1",
          "weight": "1"
        }
      ]
    },
    {
      "name": "Close Grip Pull-ups",
      "sets": [
        {
          "reps": "1",
          "weight": "1"
        }
      ]
    }
  ],
  "id": "1626b4fd-83fa-40dc-8f84-e170ff00d832"
}
```

## Logging a workout

```json
{
  "date": "2024-04-03T09:01:55.413Z",
  "volume": 0,
  "exercises": [
    {
      "name": "Deadlifts",
      "sets": [
        {
          "reps": "1",
          "weight": "1"
        }
      ]
    },
    {
      "name": "Sumo Deadlifts",
      "sets": [
        {
          "reps": "2",
          "weight": "2"
        }
      ]
    }
  ]
}
```

These JSON examples can be used in Postman to test the backend endpoints for creating custom exercises, routines, and logging workouts.
