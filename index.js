#!/usr/bin/env node
'use strict';
const program = require('commander');
const prompt = require('co-prompt');
const chalk = require('chalk');
const co = require('co');
var _ = require('underscore');
var os = require('os');
var fs = require('fs');
var path = require('path');
var services = 'services';
var controllers = 'controllers'
var views = 'views'
var pathServices =  services;
var pathController = controllers;
var pathView = views;
var srvc = fs.readFileSync(__dirname + '/templates/service.ejs', 'utf-8');
var ctrl = fs.readFileSync(__dirname + '/templates/controller.ejs', 'utf-8');

var controllerTemplate = _.template(ctrl);
var serviceTemplate = _.template(srvc);


var viewDir = path.resolve(__dirname, 'templates/views');
var viewList = fs.readdirSync(viewDir);

 program
  .option('-c, --crud <name>', 'Create controller, service and view for realtime on the fly')
  .parse(process.argv);

if(program.crud) {
  createService(function() {
    console.log(chalk.green('   Service Created by Adelia .. ') + chalk.red(':D'))
  })
  createController(() => {
    console.log(chalk.green('   Controller Created by Adelia .. ') + chalk.red(':D'))
  })

  createView(() => {
    console.log(chalk.green('   View Created by Adelia .. ') + chalk.red(':D'))
  })
}

function createView(cb) {
  var viewName = (program.route || program.crud);
  if (!fs.existsSync(views)) {
    fs.mkdirSync(views);
  }
  for(var m = 0; m < viewList.length; m++) {
      var viewFile = viewList[m];
      var view = fs.readFileSync(__dirname + '/templates/views/'+ viewFile, 'utf-8');
      var viewTemplate = _.template(view);
      var viewFileData = viewTemplate({
          viewName: viewName
      });

      if (!fs.existsSync(views+'/'+ viewName)) {
        fs.mkdirSync(views+'/'+ viewName);
      }

      var viewFileName = viewFile.replace(/\.ejs$/i, '');
      var destFile = path.normalize(pathView +'/'+ viewName + '/'+ viewFileName +'.html');
      write(destFile, viewFileData);

      if (m == (viewList.length-1)) {
        cb();
      }
  }

}

function createService(cb) {
    var serviceName = (program.route || program.crud);
    var serviceFileData = serviceTemplate({
        serviceName: serviceName
    });

    var destFile = path.normalize(pathServices +'/'+ serviceName + '.js');
    if (!fs.existsSync(services)) {
      fs.mkdirSync(services);
    }
    write(destFile, serviceFileData);
    cb();
}

function createController(cb) {
    var controllerName = (program.route || program.crud);
    var controllerFileData = controllerTemplate({
        controllerName: controllerName
    });

    var destFile = path.normalize(pathController +'/'+ controllerName + '.js');
    if (!fs.existsSync(controllers)) {
      fs.mkdirSync(controllers);
    }
    write(destFile, controllerFileData);
    cb();
}

function write(path, str, mode) {
    fs.writeFileSync(path, str, 'utf8');
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}
