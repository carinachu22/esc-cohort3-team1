# esc-cohort3-team1
## Github How-To

### Collaborating

First, clone the repository using `git clone`   
```
git clone git clone https://github.com/Purritzo/esc-cohort3-team1.git
```

## Making New changes

Before you work on a new feature, you need to do 2 things.   
Step 1: Get updated master branch with the following commands. 

```
#Get updated master branch
git checkout master
git pull origin master
```

Step 2: Create a new branch with this format `<name>-<featurename>` with the following commands
```
#Create new branch
git checkout -b <name>-<feature-name>

#Example:
git checkout -b carina-readme

```

Now, you can make your edits.

To view changes in unstaged file, use `git diff`

## Update changes to Github

Step 1: Save your file on your local computer

Step 2: Stage your changes with `git add .`

Step 3: Commit your changes with a message

```
git commit -m "Insert your commit message"

#Example:
git commit -m "Changed the readme file"

```

Step 4: Push to your branch using `git push` command:

```
git push origin <name>-<feature-name>

#Example:
git push origin carina-readme

```

Step 5: Submit a Pull Request to the `master` branch using the GitHub website `Repo master page -> Pull Request -> New pull request`

## Seeing new changes

After your pull request is successfully merged above, update your master branch with

```
git checkout master
git pull origin master

```
