# Module Federation

Module Federation is a feature in webpack, a popular JavaScript module bundler, that allows you to dynamically share code between multiple webpack builds. The concepts of "host" and "remote" play a crucial role in Module Federation.

### Host:

The host is the webpack build that serves as the main application.
It imports and uses modules from other webpack builds (remotes).
The host defines which modules it wants to consume from the remote builds.

### Remote:

The remote is a separate webpack build that exposes certain modules to be consumed by other builds (hosts).
It decides which modules to share and how they should be exposed.
Remotes can be thought of as external components or micro-frontends that can be dynamically loaded by the host.

## Pre Requisite for module federation

next version - 13.4.19

## Downgrading a project from Next.js version 14 to version 13 involves a few key steps:



