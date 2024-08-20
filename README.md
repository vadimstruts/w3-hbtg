#### Description

Application provides simple web service to generate Web3.storage HTTP Bridge tokens, based on derived proof

#### How to Install

1. Download the module to folder 'w3-hbtg'
2. `# cd w3-hbtg`
3. `# npm install -g .` - to install globally
4. `# npm install` - to resolve dependencies

#### Uninstall

```
# npm uninstall -g w3-hbtg
```

#### Run

```
w3-hbtg --help
```

#### Preparing Master key

1. To get master key, on your machine install Web3 CLI:

```
# npm install -g @web3-storage/w3cli
```

2. If you have not already logged in and created a space with the w3 CLI 
```
# w3 login you@example.com
```
then follow onscreen instructions

3. Initiate space creation for a new Space:
```
# w3 space create
```
then follow onscreen instructions



#### Steps to get proof

1. Install the `w3-hbtg` module globally on the VPS (or you server where you can use for ex. nginx as proxy for HTTP Bridge Token generator service)
2. Run next command to get agent's DID:

```
# w3-hbtg whoami
```

3. Use printed DID to get proofs from your master key. 

Go to your machine where you installed `w3` (i.e. you have master key) and execute the next command.

!!! Use DID from step #2 as `audience-did`

```
w3 delegation create -c "store/add" -c "upload/add" -n "w3-hbtg service" -t "service" -o <output file path> <audience-did>
```
where 
audience-did -  DID you printed in the step #2

Please remember list of delegated abilities: `store/add` and `upload/add` and copy the delegation file (generated) to the VPS

4. Return back to your VPS (where you installed `w3-hbtg`)

Here we have to add generated `proof` to open access to the mentioned (in the step #3) abilities, and the same abilities will be included into HTTP Bridge token returned by `w3-hbtg`

```
# w3-hbtg space add <path to delegation (proof) file>
```

5. Check that namespace is available now:

```
w3-hbtg space ls
```

command output should contain namespace's DID (from `Preparing Master key`, step #3), and it should be marked by asterisk.

if not you should select it with command:

```
# w3-hbtg space use <did>
```
where <did> - space you want to select






