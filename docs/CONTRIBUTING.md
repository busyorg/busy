## Contributing to Busy

Want to get involved in Busy developement? Thanks! There are plenty of ways you can help!

Please take a moment to review this document in order to make the contribution process easy and
effective for everyone involved.

* [Using the issue tracker](#using-the-issue-tracker)
* [Bug reports](#bug-reports)
* [Feature requests](#feature-requests)
* [Pull requests](#pull-requests)
  * [Getting started](#getting-started)
  * [Before your first Pull Request](#before-your-first-pull-request)
  * [Working on the client](#working-on-the-client)
  * [Working on the client](#working-on-the-server)
* [Team](#team)

### Using the issue tracker

The [issue tracker](https://github.com/busyorg/busy/issues) is the preferred channel
for [bug reports](#bug-reports), [features requests](#feature-requests) and [submitting pull requests](#pull-requests).

### Bug reports

A bug is a _demonstrable problem_ that is caused by the code in the repository. Good bug reports are
extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search** &mdash; check if the issue has already been reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it on [the staging server](https://staging.busy.org/).

3. **Isolate the problem** &mdash; ideally create a reduced test case and a live example.

A good bug report shouldn't leave others needing to chase you up for more information. Please try to
be as detailed as possible in your report. What is your environment? What steps will reproduce the
issue? What browser(s) and OS experience the problem? What would you expect to be the outcome? All
these details will help people to fix any potential bugs.

## Feature requests

Feature requests are welcome. But take a moment to find out whether your idea fits with the scope
and aims of the project. It's up to _you_ to make a strong case to convince the project's developers
of the merits of this feature. Please provide as much detail and context as possible.

## Pull requests

If you don't know where to start, feel free to contact us on our Discord server (#contributing channel).
If you want to create your first PR take a look at our list of
[good first issues](https://github.com/busyorg/busy/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
or list of [help wanted issues](https://github.com/busyorg/busy/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

### Getting started

1. Fork this project.
2. Clone your fork locally `git clone git@github.com:YourUsername/busy.git`
3. Create branch for your changes `git checkout -b something-amazing`
4. Commit your changes.
5. Create a [pull request](https://github.com/busyorg/busy/compare).

If you have problems setting up you might find those resources helpful:

* https://opensource.guide/how-to-contribute/#opening-a-pull-request

### Before your first Pull Request

We have precommit hooks that check your code for problems. Make sure that those pass before pushing your changes. We use [eslint](https://eslint.org/) and [Prettier](https://prettier.io/) - it's recommended to add plugins for your editor of choise for those tools.

### Working on the client

To work on the client you need to start development server using

```bash
yarn dev-server
```

After some time (it can take few minutes) you should be able to see Busy running at https://localhost:3000

Development server provides live-reload so the app will update automatically after you make a change to the code.

Client-specific code lives under [src/client][client src].

### Working on the server

Busy is Server-Side Rendered application. Working on the server requires more knowledge about Node and Express and might be more problematic.
To run the server you have to build client first:

```bash
yarn build:client
```

Afer that you can build the server:

```bash
yarn build:server:dev
```

It will create busy.server.js file that you have to run using node:

```bash
node busy.server.js
```

After you make some changes to the server you will have to rebuild it and start again (`yarn build:server:dev` and `node busy.server.js`).

Server-specific code lives under [src/server][server src]

## Team

| Fabien                     | Sekhmet              | JM               |
| -------------------------- | -------------------- | ---------------- |
| ![][bonustrack]            | ![][sekhmet]         | ![][jm90m]       |
| [@bonustrack][@bonustrack] | [@Sekhmet][@sekhmet] | [@jm90m][@jm90m] |

[@bonustrack]: https://github.com/bonustrack
[@sekhmet]: https://github.com/sekhmet
[@jm90m]: https://github.com/jm90m
[client src]: ../src/client
[server src]: ../src/server
[bonustrack]: https://avatars.githubusercontent.com/bonustrack?size=56
[sekhmet]: https://avatars.githubusercontent.com/sekhmet?size=56
[jm90m]: https://avatars.githubusercontent.com/jm90m?size=56
