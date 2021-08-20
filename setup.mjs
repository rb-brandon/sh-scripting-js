const opts = {
  monitor:xrandr_top,
  monitoroff:xrandr_off,
  async keyboardoff() { await $`xset led off` },
  keyboard: () => $`xset led on`,
  async swhy() {
    console.log('you smell like a fish monger', $)
    await $`env`
    return 42
  },
  usage,
  async profile(argv) {
    let tip = profiles, key_path=[]
    while (0 !== argv.length) {
      let k = argv.shift()
      key_path.push(k)
      if (undefined === tip[k]) {
        console.log('Profiles:', key_path.join(' >> '), tip)
        return
      }
      tip = tip[k]
    }

    if (tip[Symbol.iterator]) {
      for (let step of tip)
        await step()
    } else {
      console.log('Profiles:', key_path.join(' >> '), tip)
    }
  },
  test,
}

const profiles = {
  work: {
    on:[xrandr_top, opts.keyboard],
    off:[xrandr_off, opts.keyboardoff]
  },
  swhy: {
    secret: { in_dark: [() => console.log("SEMMLL:")] }}
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
async function test() { await $`ls -la`.pipe(process.stdout) }
async function usage() {
  console.log(
    "Options are ::\n",
    Object.keys(opts).map(e => `-- ${e}`)
  )}

function process_args(argv) {
  let fn = opts[argv.shift()] || opts.usage
  return fn.bind(opts, argv)
}

{
  let fn_main = process_args(process.argv.slice(3))
  await fn_main()
}
