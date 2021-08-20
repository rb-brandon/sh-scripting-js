const opts = {
  monitor:xrandr_top,
  monitoroff:xrandr_off,
  keyboard:keyboard_light,
  keyboardoff:keyboard_light_off,
  usage:usage,
  profile:profile,
  test:test
}

const profiles = {
  work: {
    on:[xrandr_top, keyboard_light],
    off:[xrandr_off, keyboard_light_off]
  }
}

function call_(f){return f()}
async function profile() {
  let cmd_phrase = process.argv.slice(4)
  Promise.all(
    (profiles[cmd_phrase.shift()][cmd_phrase.shift()]).map(call_)
  ) 
}

async function xrandr_top() { await $`xrandr --output HDMI-1 --auto --above eDP-1` }
async function xrandr_off() { await $`xrandr --output HDMI-1 --off` }
async function keyboard_light() { await $`xset led on` }
async function keyboard_light_off() { await $`xset led off` }
async function test() { await $`ls -la`.pipe(process.stdout) }
async function usage() {
  console.log(
    "Options are ::\n",
    Object.keys(opts).map(e => `-- ${e}`)
  )}

function process_args() {
  let fn = opts[process.argv.slice(3).shift()]
  return "function" === typeof fn 
    ? fn
    : opts["usage"]
}

await (process_args())()
