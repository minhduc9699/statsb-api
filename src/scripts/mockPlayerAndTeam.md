# Mock Player and Team Data Script

This script generates mock data for the Player and Team collections using Mongoose models.

## Usage

1. Ensure your MongoDB instance is running and environment variables are set up (see `.env`).
2. Run the script:

```bash
node src/scripts/mockPlayerAndTeam.js
```

- This will clear existing Player and Team data, then insert new mock records.
- You can adjust the number of players, teams, and players per team by editing the constants at the top of the script.

## Dependencies
- Uses `faker` for random data. Install with:
  ```bash
  npm install faker
  ```
- Requires existing Player and Team models.

## Notes
- The script respects enum values for player positions and team roster fields.
- All code is formatted with Prettier and adheres to ESLint rules.

---

_Last updated: 2025-04-27_
