## Contributing to Busy

Want to get involved in Busy development? Thanks! There are plenty of ways you can help!

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

* [Using the issue tracker](#using-the-issue-tracker)
* [Bug reports](#bug-reports)
* [Feature requests](#feature-requests)
* [Pull requests](#pull-requests)
  * [Getting started](#getting-started)
  * [Before your first Pull Request](#before-your-first-pull-request)
  * [Starting development server](#starting-development-server)
  * [Working on the client](#working-on-the-client)
  * [Working on the client](#working-on-the-server)
  * [Common problems](#common-problems)
    * [Failing snapshot tests](#failing-snapshot-tests)
    * [JavaScript heap out of memory on OSX](#javascript-heap-out-of-memory-on-osx)
* [How to guides](#how-to-guides)
  * [Adding new translations](#adding-new-translations)
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

A good bug report shouldn't leave others needing to chase you up for more information.
Please try to be as detailed as possible in your report. What is your environment?
What steps will reproduce the issue? Which browsers and OS has the problem?
What would you expect to be the outcome? All these details will help people to fix any potential bugs.

## Feature requests

Feature requests are welcome. Take a moment to find out whether your idea fits with the scope
and aims of the project. It's up to _you_ to make a strong case to convince the project's developers
of the merits of this feature. Please provide as much detail and context as possible.

## Pull requests

If you don't know where to start, feel free to contact us on our Discord server (#contributing channel).
If you want to create your first PR take a look at our list of
[good first issues](https://github.com/busyorg/busy/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
or list of [help wanted issues](https://github.com/busyorg/busy/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).
Issues marked as In progress are currently taken by someone. When you found an issue that you would like to work on,
let us know in the issue so we can mark it as In progress.

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

### Getting started

1. Fork this project.
2. Clone your fork locally:
   `git clone git@github.com:YourUsername/busy.git`

   If you didn't add your SSH key to GitHub you can [add it](https://help.github.com/articles/connecting-to-github-with-ssh/),
   or use HTTPS clone:

   `git clone https://github.com/busyorg/busy.git`

3. Install dependencies: `yarn`
4. Create branch for your changes: `git checkout -b something-amazing`
5. Commit your changes.
6. Create a [pull request](https://github.com/busyorg/busy/compare).

If you have problems setting up you might find those resources helpful:

* https://opensource.guide/how-to-contribute/#opening-a-pull-request

### Before your first Pull Request

We have precommit hooks that check your code for problems. Make sure that they
pass before pushing your changes. We use [eslint](https://eslint.org/)
and [Prettier](https://prettier.io/) - it's recommended to add plugins for your editor
of choise for those tools.

Running linter (code formatting and syntax errors):

```bash
yarn lint
```

Running Prettier (code formatting):

```bash
yarn prettier-check-all
```

Running tests:

```bash
yarn test
```

### Starting development server

To start development server you need to run one command:

```bash
yarn dev
```

After some time (it can take few minutes) you should be able to see Busy running at http://localhost:3000

After making some change to the code web browser will reload (in case of client code) or server will reload
(you need to refresh page manually).

### Working on the client

Client-specific code lives under [src/client][client src].

### Working on the server

Server-specific code lives under [src/server][server src].

If server didn't reload properly you can just type `rs` in the console.

### Common problems

#### Failing snapshot tests

We use snapshots for some of the components to prevent regression.
If you are working on component and change its structure it’s possible that snapshots won’t match anymore.
Let’s say you changed Topics header from h3 to h4:

```diff
diff --git a/src/client/components/Sidebar/Topics.js b/src/client/components/Sidebar/Topics.js
index 6970196..5803ca3 100644
--- a/src/client/components/Sidebar/Topics.js
+++ b/src/client/components/Sidebar/Topics.js
@@ -38,12 +38,12 @@ class Topics extends React.Component {

     return (
       <div className="Topics">
-        <h4>
+        <h3>
           <FormattedMessage
             id={favorite ? 'favorite_topics' : 'trending_topics'}
             defaultMessage={favorite ? 'Favorite topics' : 'Trending topics'}
           />
-        </h4>
+        </h3>
         {loading && <Loading center={false} />}
         {!loading && (
           <ul className="Topics__list">
```

Due to this change, snapshot tests will now fail:

```bash
Snapshot Summary
 › 1 snapshot test failed in 1 test suite. Inspect your code changes or run `yarn test -u` to update them.

Test Suites: 1 failed, 20 passed, 21 total
Tests:       1 failed, 52 passed, 53 total
Snapshots:   1 failed, 13 passed, 14 total
Time:        9.295s, estimated 18s
```

As you can see all you have to do is update snapshots by running:

```bash
yarn test -u
```

Then you can add updated files and commit them again.

#### JavaScript heap out of memory on OSX

There is known problem with development server crashing on OSX.
https://github.com/busyorg/busy/issues/1675

Workaround for this issue is downgrading to older version of antd.
yarn add antd@2.13.11

## How to guides

### Adding new translations

Every text display to users should be localized. To make sure text is properly localized you should:

1. Add this text to [default.json][default.json] file.
2. Use `FormattedMessage` or `intl.formatMessage` (the latter requires `intl` object).

Let’s say you want to add Hello World text above Trending topics. First add new translation to default.json:

```diff
diff --git a/src/client/locales/default.json b/src/client/locales/default.json
index 08db20f..e80e47a 100644
--- a/src/client/locales/default.json
+++ b/src/client/locales/default.json
@@ -335,5 +335,6 @@
   "upvote_setting_details": "Enable this option to automatically like your own posts.",
   "upvote_setting": "Like my posts",
   "dmca_content_removed": "Content removed due to DMCA notice",
-  "drafts_memory_usage_error": "Oops! You hit the storage limit of 16mb, delete some drafts to go forward"
+  "drafts_memory_usage_error": "Oops! You hit the storage limit of 16mb, delete some drafts to go forward",
+  "hello_world": "Hello World"
 }
```

And then you can use it with `FormattedMessage`:

```diff
diff --git a/src/client/components/Sidebar/Topics.js b/src/client/components/Sidebar/Topics.js
index 6970196..b72964a 100644
--- a/src/client/components/Sidebar/Topics.js
+++ b/src/client/components/Sidebar/Topics.js
@@ -44,6 +44,7 @@ class Topics extends React.Component {
             defaultMessage={favorite ? 'Favorite topics' : 'Trending topics'}
           />
         </h4>
+        <FormattedMessage id="hello_world" defaultMessage="Hello World" />
         {loading && <Loading center={false} />}
         {!loading && (
           <ul className="Topics__list">
```

Remember to use the same `id` and `defaultMessage` in default.json file and component itself.

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
[default.json]: ../src/client/locales/default.json
[bonustrack]: https://avatars.githubusercontent.com/bonustrack?size=56
[sekhmet]: https://avatars.githubusercontent.com/sekhmet?size=56
[jm90m]: https://avatars.githubusercontent.com/jm90m?size=56
