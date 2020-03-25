#!/usr/bin/env node
import yargs from "yargs";
import { eject, EjectSettings } from "./";
const argv = yargs.argv as EjectSettings;

eject(argv);
