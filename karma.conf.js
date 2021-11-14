/*
 * Copyright 2019 Nazmul Idris. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const webpackDevConfig = require('./build/webpack.dev.conf');
const webpackBaseConfig = require('./build/webpack.base.conf')

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ["mocha", "chai", "sinon"],
        files: ['test/*.ts'],
        exclude: [],
        preprocessors: {
            './test/*.ts': ['webpack'],
            'src/*.ts': ['coverage']
        },
        webpack: {
            module: webpackBaseConfig.module,
            resolve: webpackBaseConfig.resolve,
        },
        reporters: ['progress', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity,
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        }
    });
};