# mm-checkout

# Project steps:

## Backend: 
1. Send POST request with feedback to database - done, but has to include all fields for database to take it in
2. Ensure authentication works
3. Make sure channel pages work and list all feedback by date/channel as needed - done
4. Deploy to AWS - done

## Frontend: 
1. Create checkout form as Mattermost slash command
2. Use React :) - done
3. Ensure numbers and scripts all in one form - done
4. Ensure form appears when button in channel is clicked 
5. Ensure that pressing submit button sends feedback to backend to submit to database, with correct body names 
6. Make it pretty :) - done
7. Deploy to AWS - done

## Database: 
1. Make sure database tables work well with what feedback form submits 
2. Ensure aggregation of data works based on former GF Checkout Spring app (ideally split out this part of old app as stand-alone app)
3. Make sure aggregated data ends up in team_checkout table 
