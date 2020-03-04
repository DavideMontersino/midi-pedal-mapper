import React, { useEffect, useState } from "react";
import "./styles.css";
import WebMidi, { Input, Output } from "webmidi";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));
// https://help.ableton.com/hc/en-us/articles/209774225-How-to-setup-a-virtual-MIDI-bus#Mac

export default function App() {
  useEffect(() => {
    console.log("test");
    WebMidi.enable(err => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        console.log("WebMidi enabled!");
        // setMidiOutputs(WebMidi.outputs);
        // setMidiInputs(WebMidi.inputs);
        // console.log(midiOutputs);
      }
    }, true);
  });

  // const [midiOutputs, setMidiOutputs] = useState();
  const [midiInput, setMidiInput] = React.useState<Input>(WebMidi.inputs[0]);
  const [midiOutput, setMidiOutput] = React.useState<Output>(
    WebMidi.outputs[0]
  );

  const classes = useStyles();

  console.log({ inputs: WebMidi.inputs });

  useEffect(() => {
    console.log("input changed");
    if (!WebMidi.inputs) {
      return;
    }

    WebMidi.inputs.forEach(i => i.removeListener());
  }, [midiInput]);

  useEffect(() => {
    console.log("input changed");
    if (!WebMidi.outputs) {
      return;
    }
    WebMidi.outputs.forEach(i => i.removeListener());
  }, [midiOutput]);
  return (
    <div className="App">
      <FormControl className={classes.formControl}>
        <InputLabel id="midi-input-label">Input</InputLabel>
        <Select
          labelId="midi-input-label"
          id="midi-input-select"
          value={(midiInput || {}).id}
          onChange={v =>
            setMidiInput(WebMidi.getInputById(v.target.value as string))
          }
        >
          {WebMidi.inputs &&
            WebMidi.inputs.map((mi: Input) => (
              <MenuItem key={mi.id} value={mi.id}>{`${mi.manufacturer} -  ${
                mi.name
              } (${mi.connection} / ${mi.state})`}</MenuItem>
            ))}
        </Select>
      </FormControl>
      <br />
      <FormControl className={classes.formControl}>
        <InputLabel id="midi-output-label">Output</InputLabel>
        <Select
          labelId="midi-output-label"
          id="midi-output-select"
          value={(midiOutput || {}).id}
          onChange={v => {
            console.log({
              id: v.target.value,
              output: WebMidi.getOutputById(v.target.value as string)
            });
            setMidiOutput(WebMidi.getOutputById(v.target.value as string));
          }}
        >
          {WebMidi.outputs &&
            WebMidi.outputs.map((mi: Output) => (
              <MenuItem key={mi.id} value={mi.id}>{`${mi.manufacturer} -  ${
                mi.name
              } (${mi.connection} / ${mi.state})`}</MenuItem>
            ))}
        </Select>
      </FormControl>
      <pre>
        {JSON.stringify(midiInput, null, "\t")}
        <br />
        {JSON.stringify(midiOutput, null, "\t")}
      </pre>
    </div>
  );
}
