## Why

I always forget to fill out this form at the beginning of the day, which produces a situation of delay and even danger when I have to use my cell phone outside the university.

Since the university does not impose any security measures on this form, anyone can fill out the form, so I decided to create a bot to do it for me. 

## How

1. Fork this repository
2. Add your RUT as 'rut' on Github Actions ENV
   1. Settings
   2. Secrets
   3. Actions
      1. New Repository Secret
         1. Name: rut
         2. Value: YOUR_RUT
3. Click Actions
   1. Click on "I understand my workflows, go ahead and enable them"
   2. On "Workflows" click "BOT RUN"
   3. Click on "Enable Workflow"
   4. Click Run Workflow
      1. Run Workflow
4. Enjoy!


### Can't find the secrets? (low quality, only for reference)
![Tutorial](https://media2.giphy.com/media/mblUmq4djCKIy3ZMmL/giphy.gif)

## When

This script runs every 10 minutes (or when GitHub decides it's the best time to run the action), this will ensure the authorization every day.

<!-- CONTACT -->
## Who

Franco Sanllehi - [@SanllehiFranco](https://twitter.com/SanllehiFranco) - francosanllehi@gmail.com

Project Link: [https://github.com/DmACKGL/AutoCOVID](https://github.com/DmACKGL/AutoCOVID)

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.



