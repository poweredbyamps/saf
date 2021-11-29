import {Command, flags} from '@oclif/command'
import fs from 'fs'
import {ASFFMapper as Mapper} from '@mitre/hdf-converters'

function checkSuffix(input: string) {
  if (input.endsWith('.json')) {
    return input
  }
  return `${input}.json`
}

export default class ASFFMapper extends Command {
  static usage = 'asff_mapper -j <asff-finding-json> [--securityhub <standard-1-json> ... <standard-n-json>] -o <hdf-scan-results-json>'

  static description = fs.readFileSync('./help/prowler_mapper.md', {encoding: 'utf-8'}).split('Examples:\n')[0]

  static examples = [fs.readFileSync('./help/prowler_mapper.md', {encoding: 'utf-8'}).split('Examples:\n')[1]]

  static flags = {
    help: flags.help({char: 'h'}),
    json: flags.string({char: 'j', required: true}),
    output: flags.string({char: 'o', required: true}),
  }

  async run() {
    const {flags} = this.parse(ASFFMapper)
    // comes as an asff-json file which is basically all the findings concatenated into one file instead of putting it in the proper wrapper data structure
    const input = `{"Findings": [${fs.readFileSync(flags.json, {encoding: 'utf-8'}).trim().split('\n').join(',')}]}`
    const meta = {name: 'Prowler', title: 'Prowler Findings'}
    const converter = new Mapper(input, undefined, meta)
    fs.writeFileSync(checkSuffix(flags.output), JSON.stringify(converter.toHdf()))
  }
}

