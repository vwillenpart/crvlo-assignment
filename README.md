# Flight Subscription Quota Management Assignment

## Exercise Overview

This exercise focuses on improving our back office platform and UI to make it easier for airline managers to manage flight subscriptions. 
The goal is to empower the airline support team to manage the exceptional addition or deduction of a user's subscription quota.

### Acceptance Criteria

1. The agent can add or reduce quota for a specific subscriber using a simple interface with two controls (quota field and reason field).
2. The agent cannot add or reduce quota without selecting a reason.
3. When adding quota, the reason field should display the following options:
   - Subscriber canceled flight
   - Airline canceled flight
   - Customer compensation
   - Other
4. When removing quota, the reason field should display the following options:
   - Flight not redeposited after a flight cancellation
   - Subscriber had login or password issues
   - Subscriber had issues when booking
   - Subscription has not renewed correctly
   - Other
5. The save button is only active when the quota has been changed and a reason has been selected.
6. The agent cannot add a quota higher than 3 flights.
7. The agent cannot remove a quota lower than 0.
8. Clicking the X (close) button should close the modal without applying any changes.
9. Clicking the save button should save the changes and display a contextual success/error message.

### ✨ Additional Criteria

1. Agent can visualize at all times the current number of flights saved for the user as a small subtitle on the top.
2. The reasons are updated based on the current number of flights saved, not the number edited at each time.
3. When Other reason is selected, display a free text input for the agent to write a custom reason.

## 💡 Usage

### Starting the Development Server

To start the development server with hot-reload, run the following command. The server will be accessible at [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

### Running unit tests

To build your project for production, use:

```bash
npm run test:unit
```

## Contact info

[email me](mailto:vic.willenpart@gmail.com)