# Easy Spaces Lightning Web Components Sample Application

> IMPORTANT: This is the new Lightning Web Components version of the Easy Spaces sample application. If you are looking for the Aura version, click [here](https://github.com/trailheadapps/easy-spaces).

![Easy Spaces Logo](./docs/EasySpacesWithText.png)

[![CircleCI](https://circleci.com/gh/trailheadapps/easy-spaces-lwc.svg?style=svg)](https://circleci.com/gh/trailheadapps/easy-spaces-lwc)

Easy Spaces is a fictional event management company that creates and manages custom pop-up spaces for companies and individuals. Easy Spaces helps customers create temporary spaces like cafés, game rooms or themed rooms for special occasions in their offices and homes.

[![Thumbnail](./docs/space_designer.png)](https://youtu.be/ZwvegTLx9kk)

> This sample application is designed to run on Salesforce Platform. If you want to experience Lightning Web Components on any platform, please visit https://lwc.dev, and try out our Lightning Web Components sample application [LWC Recipes OSS](https://github.com/trailheadapps/lwc-recipes-oss).

## Table of Contents

-   Installation Instructions

    -   [Installing Easy Spaces using a Scratch Org](#installing-easy-spaces-using-a-scratch-org)
    -   [Installing Easy Spaces using Unlocked Packages](#installing-easy-spaces-using-unlocked-packages)
    -   [Completing the Installation](#completing-the-installation)

-   [Optional installation instructions](#optional-installation-instructions)

-   [Features](#features)

-   [Code Highlights](#code-highlights)

## Installation Instructions

There are two ways to install Easy Spaces:

-   [Using a Scratch Org](#installing-easy-spaces-using-a-scratch-org): This is the recommended installation option. Use this option if you are a developer who wants to experience the app and the code.
-   [Using Unlocked Packages](#installing-easy-spaces-using-unlocked-packages): This option allows anybody to experience the sample app without installing a local development environment.

### Installing Easy Spaces using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

-   Enable Dev Hub in your Trailhead Playground
-   Install Salesforce CLI
-   Install Visual Studio Code
-   Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

2. If you haven't already done so, authenticate with your hub org and provide it with an alias (**myhuborg** in the command below):

```
sfdx force:auth:web:login -d -a myhuborg
```

3. Clone this repository:

```zsh
git clone https://github.com/trailheadapps/easy-spaces-lwc
cd easy-spaces-lwc
```

4. Create a scratch org and provide it with an alias (**easyspaces** in the command below):

```zsh
sfdx force:org:create -s -f config/project-scratch-def.json -a easyspaces
```

5. Push source to your scratch org:

```zsh
sfdx force:source:push
```

6. Assign two Easy Spaces permission sets to the default user:

```zsh
sfdx force:user:permset:assign -n EasySpacesObjects
sfdx force:user:permset:assign -n SpaceManagementApp
```

7. Load sample data:

```zsh
sfdx force:data:tree:import -p ./data/Plan1.json
sfdx force:data:tree:import -p ./data/Plan2.json
```

8. Open the scratch org:

```zsh
sfdx force:org:open
```

9. In **Setup**, navigate to **Themes and Branding**

10. Activate the **Easy Spaces** theme

### Installing Easy Spaces using Unlocked Packages

Use this option if you don't have the Salesforce CLI configured and want to experience the sample app. Because Easy Spaces is built on a set of related units, you'll be installing a series of unlocked packages. You'll also be importing sample data, after installing packages.

1. [Sign up](https://developer.salesforce.com/signup) for a Developer Edition (DE) org.

2. Enable MyDomain in your DE org. Instructions to do this are [here](https://trailhead.salesforce.com/modules/identity_login/units/identity_login_my_domain).

3. Click [this link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB0000000OEGAIA4) to install the **es-base-objects** package and choose **Install for All Users**.

4. Click [this link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB0000000OEGFIA4) to install the **es-base-code** package and choose **Install for All Users**.

5. Click [this link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB0000000OEGKIA4) to install the **es-base-styles** package and choose **Install for All Users**.

6. Click [this link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04tB0000000OEGPIA4) to install the **es-space-mgmt** package and choose **Install for All Users**.

7. From the command line, enter the following commands to clone this repository. You need to do this to get the files with sample data on your computer:

```zsh
git clone https://github.com/trailheadapps/easy-spaces-lwc
cd easy-spaces-lwc
```

8. Import Lead data:

-   In **Setup**, type **Data Import** in the Quick Find box and click **Data Import Wizard**.
-   Click **Launch Wizard**.
-   Click the **Standard objects** tab, click **Leads**, and click **Add New Records**.
-   Drag **Lead_Data.csv** from the data folder of this project to the upload area.
-   Click **Next**, **Next**, and **Start Import**.

9. Import Contact data:

-   In **Setup**, type **Data Import** in the Quick Find box and click **Data Import Wizard**.
-   Click **Launch Wizard**.
-   Click the **Standard objects** tab, click **Accounts and Contacts**, and click **Add New Records**.
-   Drag **Contact_Data.csv** from the data folder of this project to the upload area.
-   Click **Next**, **Next**, and **Start Import**.

10. Import Market data:

-   In **Setup**, type **Data Import** in the Quick Find box and click **Data Import Wizard**.
-   Click **Launch Wizard**.
-   Click the **Custom objects** tab, click **Markets**, and click **Add New Records**.
-   Drag **Market_Data.csv** from the data folder of this project to the upload area.
-   Click **Next**, **Next**, and **Start Import**.

11. Import Spaces data:

-   In **Setup**, type **Data Import** in the Quick Find box and click **Data Import Wizard**.
-   Click **Launch Wizard**.
-   Click the **Custom objects** tab, click **Spaces**, and click **Add New Records**.
-   In the **Add New Records** menu, under _Which Market field in your file specifies the Master/Detail relationship?_ select **Market Name**
-   Drag **Space_Data.csv** from the data folder of this project to the upload area.
-   Click **Next**, **Next**, and **Start Import**.

12. In **Setup**, navigate to **Themes and Branding**

13. Activate the **Easy Spaces** theme

#### Explore the application

1. In **App Launcher**, select the **Space Management** app.

2. Note: Before trying to work with the Spaces Designer, use the **Reservation Manager** to draft a few reservations.

3. Have fun exploring!

## Optional Installation Instructions

This repository contains several files that are relevant if you want to integrate modern web development tooling to your Salesforce development processes, or to your continuous integration/continuous deployment processes.

### Code formatting

[Prettier](https://prettier.io/) is a code formatter used to ensure consistent formatting across your code base. To use Prettier with Visual Studio Code, install [this extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) from the Visual Studio Code Marketplace. The [.prettierignore](/.prettierignore) and [.prettierrc](/.prettierrc) files are provided as part of this repository to control the behavior of the Prettier formatter.

### Code linting

[ESLint](https://eslint.org/) is a popular JavaScript linting tool used to identify stylistic errors and erroneous constructs. To use ESLint with Visual Studio Code, install [this extension](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode-lwc) from the Visual Studio Code Marketplace. The [.eslintignore](/.eslintignore) file is provided as part of this repository to exclude specific files from the linting process in the context of Lighning Web Components development.

### Pre-commit hook

This repository also comes with a [package.json](./package.json) file that makes it easy to set up a pre-commit hook that enforces code formatting and linting by running Prettier and ESLint every time you `git commit` changes.

To set up the formatting and linting pre-commit hook:

1. Install [Node.js](https://nodejs.org) if you haven't already done so
2. Run `npm install` in your project's root folder to install the ESLint and Prettier modules (Note: Mac users should verify that Xcode command line tools are installed before running this command.)

Prettier and ESLint will now run automatically every time you commit changes. The commit will fail if linting errors are detected. You can also run the formatting and linting from the command line using the following commands (check out [package.json](./package.json) for the full list):

```
npm run lint:lwc
npm run prettier
```

## Features

A quick overview of the features you can explore in Easy Spaces:

-   Modular app design and Unlocked Packages
-   Lightning Console APIs & Background Refresh Methods
-   Lightning Flow

    -   Dynamic flow interview components
    -   Custom flow screen components
    -   Local Action components

-   Custom Lightning Page Templates

-   Lightning Theming

-   Custom Metadata Types

## Code Highlights

### Dynamic Flows and Local Action Components

The **spaceDesigner** and **reservationHelper** Aura components render flow interviews dynamically, by using the **lightning:flow** base component. You can see the **reservationHelperForm** and **spaceDesignForm** Lightning web components at work as screens in these dynamic flows. Both of these components use **lightning__FlowScreen** as the target in the component’s <targets> tag, and **FlowNavigationNextEvent** event from the **lightning/flowSupport** module to control flow navigation actions.

See this [blog post](https://developer.salesforce.com/blogs/2018/06/announcing-the-easy-spaces-app.html) for more detail about custom flow navigation and dynamic flow interviews.

These components used as Lightning Flow screens also use a convention in the markup of their meta files, to help developers better track how properties are being used by flow interviews. See the [reservationHelperForm](./es-space-mgmt/main/default/lwc/reservationHelperForm/reservationHelperForm.js-meta.xml) and [spaceDesignForm](./es-space-mgmt/main/default/lwc/spaceDesignForm/spaceDesignForm.js-meta.xml/es-space-mgmt/main/default/aura/designFormCmp/designFormCmp.design) component meta files for examples.

### Object-Agnostic Design

The **customerList** and **customerTile** Lightning web components can display information from Contact objects or Lead objects. In the Reservation Manager app page, both Lead and Contact variations are used in order to create a unified workspace:

![Two instances of customerList component on canvas in Lightning App Builder](./docs/reservation_manager.png)

The customerList Lightning web component uses a design attribute to allow for users working in Lightning App Builder to control which object an instance of the Lightning web component should display:

![customerList component design attribute as picklist in Lightning App Builder](./docs/customerList_design.png)

This is just one example of object-agnostic design at work in Easy Spaces. See this [blog post](https://developer.salesforce.com/blogs/2018/06/announcing-the-easy-spaces-app.html) for more detail about this pattern.

### Console Navigation and Background Refresh

Easy Spaces uses the Lightning Console JavaScript API and the Lightning web component NavigationMixin to control user navigation between tabs and subtabs. You can see the lightning:workspaceAPI component at work in the **openRecordAction** Aura component, which enables flow interviews to navigate users to a new subtab. The **reservationHelperAura** and **spaceDesignerAura** components use the lightning:navigationItemAPI component to refresh custom Lightning Page tabs in the background as a user works. You can get more detail about using the Workspace API in your components in this [blog post](https://developer.salesforce.com/blogs/2018/06/announcing-the-easy-spaces-app.html).

Lightning web components use the NavigationMixin control navigation behavior. You can see the NavigationMixin at work in the [relatedSpaces](./es-space-mgmt/main/default/lwc/relatedSpaces/relatedSpaces.js), [customerTile](./es-space-mgmt/main/default/lwc/customerTile/customerTile.js) and [reservationTile](./es-space-mgmt/main/default/lwc/reservationTile/reservationTile.js) Lightning web components. The **customerList** and **reservationList** Lightning web components use Lightning Data Service wired methods to display data from Apex. This allows the platform to handle provisioning and managing a client-side cache. These components programmatically refresh that wired data, based on user interactions with sibling Aura components. Check out the code in [reservationList](./es-space-mgmt/main/default/lwc/reservationList/reservationList.js) and [customerList](./es-space-mgmt/main/default/lwc/customerList/customerList.js) Lightning web component Javascript files.

### Modular Design and Unlocked Packaging

Easy Spaces illustrates how to organize application metadata into granular units or modules. This approach is reflected in the design patterns at work throughout the application, like the use of object-agnostic components. But you'll also see this at work in the structure of the Easy Spaces repo itself.

The Easy Spaces application is made of several, interdependent unlocked packages. The dependecies between the Easy Spaces packages are listed in the [sfdx-project.json](./sfdx-project.json) file for this repo.

You can also explore the contents of each package by looking at the related package folder within this repo. The `path` attribute entries in the sfdx-project.json show which folder contains the metadata for a particular package.

For more about how the Easy Spaces metadata is organized into package modules, check out [this post](https://developer.salesforce.com/blogs/2018/06/working-with-modular-development-and-unlocked-packages-part-2.html).
