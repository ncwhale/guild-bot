// Scan the directory, load feature one by one in this order:
// 1. Path itself(for index.[m]js)
// 2. subfolder&.[m]js files order by basename in alphabet
// 3. no recursion scan in subfolders. Instead, use this module with 
//    config: { path: __dirname }

// All bot features are equal to each other:
// 1. Export a constructor function/class with config as param.
// 2. After new, return a object with binding key:function.
// 3. When message coming, every features with match function will be called in load order.
// 4. Every feature function can be async, and will wait if promise returned.
// 5. If any subprocess need return a value to TG API, use ctx.body.
//    Warning: return value may overrite each other, use Object.assign or Array.push.

const fs = require('fs').promises

async function bot_loader(config) {
  config = Object.assign({
    path: './bot/features'
  }, config)

  

}

function load_js_module(file) {
  // try load file as cjs first
  let feature = load_cjs_module(file)
  if (feature instanceof Function) return feature

  // if fail, try load it as ejs
  let feature = load_ejs_module(file)
  if (feature instanceof Function) return feature

  // final fail.
  return null
}

function load_cjs_module(file) {
  try {
    const feature = require(file)
    if (feature instanceof Function) return feature
  } catch (err) {
    return null
  }

  return null
}

async function load_ejs_module(file) {
  try {
    const feature = (await import(file)).default
    if (feature instanceof Function) return feature
  } catch (err) {
    return null
  }

  return null
}

module.exports = bot_loader