# Workers

There are times when you don't want an HTTP endpoint to process functionality that may take a while.

In this cases, a developer can enqueue the work, and the workers will dequeue the work and do processing
for as long as is needed.

This is best for tasks that the user isn't specifically waiting for a response from or for tasks that take a long time.