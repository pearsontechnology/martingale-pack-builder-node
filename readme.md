# Martingale Pack Builder

Used to test and create Pack distributions from source files for Martingale Packs.

## Commands

### Doc

Used to create a readme.md from the pack definition file.

#### Usage:

From within your Pack source folder:

```
mpack doc [-h] [-s SOURCEFILENAME] [-d DESTFILENAME] [-t TEMPLATEFILE]
```

#### Optional arguments:
```
  -h, --help            
                        Show this help message and exit.
  -s SOURCEFILENAME, --source SOURCEFILENAME, --source-file SOURCEFILENAME
                        Name of the source file to process. Default "pack.yaml"
  -d DESTFILENAME, --dest DESTFILENAME, --dest-file DESTFILENAME
                        Base name of the destination file to provide. Default "readme.md"
  -t TEMPLATEFILE, --template TEMPLATEFILE, --template-file TEMPLATEFILE
                        Handlebars template file to process, use internal one if not specified.
```

### Build

Used to compile raw pack files into an official yaml or json pack file.

#### Usage:

From within your Pack source folder:

```
mpack build [-h] [-v] [-s SOURCEFILENAME] [-d DESTFILENAME] [-o OUTPUTFORMAT] [-l MINLOGLEVEL]
```

#### Optional arguments:

```
  -h, --help            
              Show this help message and exit.
  -v, --version         
              Show program's version number and exit.
  -s SOURCEFILENAME, --source SOURCEFILENAME, --source-file SOURCEFILENAME
              Name of the source file to process. Default "pack.yaml"
  -d DESTFILENAME, --dest DESTFILENAME, --destination DESTFILENAME, --destination-file DESTFILENAME
              Name of the output file. Default "dist/pack.<outputFormat>"
  -o OUTPUTFORMAT, --outputFormat OUTPUTFORMAT, --output-format OUTPUTFORMAT
              Specifies the output format. Default "yaml"
  -l MINLOGLEVEL, --log MINLOGLEVEL, --log-level MINLOGLEVEL
              Minimum log level to show. Default "debug"
```

### Test

Used to provide a simple web server based distribution for testing your pack locally.  Compiles and serves the final pack file on every request.

#### Usage:

From within your Pack source folder:

```
mpack test [-h] [-v] [-s SOURCEFILENAME] [-d DESTFILENAME] [-p PORT] [-c CORS] [--host HOST] [-l MINLOGLEVEL]
```

#### Optional arguments:

```
  -h, --help            
              Show this help message and exit.
  -v, --version         
              Show program's version number and exit.
  -s SOURCEFILENAME, --source SOURCEFILENAME, --source-file SOURCEFILENAME
              Name of the source file to process. Default "pack.yaml"
  -d DESTFILENAME, --dest DESTFILENAME, --dest-file DESTFILENAME
              Base name of the destination file to provide. Default "/pack"
  -p PORT, --port PORT  
              Port to use. Default 8080, use 0 to select a random available port.
  -c CORS, --cors CORS  
              Sets the Access-Control-Allow-Origin header. Default *
  --host HOST           
              Hostname to bind to. Defaults to system name
  -l MINLOGLEVEL, --log MINLOGLEVEL, --log-level MINLOGLEVEL
              Minimum log level to show. Default "debug"
```

### Test

Used to split an existing pack file back in to manageable source files.

#### Usage:

From within your Pack source folder:

```
mpack split [-h] [-s SOURCEFILENAME] [-d DESTFILENAME]
```

#### Optional arguments:

```
  -h, --help
                        Show this help message and exit.
  -s SOURCEFILENAME, --source SOURCEFILENAME, --source-file SOURCEFILENAME
                        Name of the source file to process. Default "pack.yaml"
  -d DESTFILENAME, --dest DESTFILENAME, --dest-file DESTFILENAME
                        Base name of the destination file to provide. Default "pack.yaml"
```

## Project Setup

To start a new Pack create a new folder, then create a package.json file in the new folder.  Copy the below template and update the values in to package.json:

```
{
  "name": "your-package-name",
  "version": "0.0.1",
  "description": "Some description about what your pack does",
  "repository": "The repo that belongs to your pack",
  "author": "Your Name <your@email.com>",
  "scripts": {
    "build": "mpack build",
    "test": "mpack test",
    "doc": "mpack doc"
  },
  "dependencies": {
    "martingale-pack-builder": "^0.0.1"
  },
  "license": "MIT"
}
```

On the command line, in the folder where you created the package.json file issue:

```
npm install
```

or

```
yarn install
```

You can now use:

 * "yarn/npm test" to test your pack locally.
 * "yarn/npm build" command to create a production build of your pack.
 * "yarn/npm doc" to generate the documentation for your pack.
