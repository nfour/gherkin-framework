import { GherkinTest } from '../GherkinTest';
import { IGherkinTableParam } from '../types';

const getNumbers = (state: {} = {}, a: number, b: number) => {
  return {
    ...state,
    a, b,
  };
};

const addNumbers = (state: { a: number, b: number }) => {
  const { a, b } = state;

  return {
    ...state,
    c: a + b,
  };
};

const multiplyNumbers = (state: { a: number, b: number }) => {
  const { a, b } = state;

  return {
    ...state,
    c: a * b,
  };
};

const checkResult = ({ c }: { c: number }, expected: number) => {
  expect(c).toBe(expected);
};

/**
 * TODO: provide a concept for the framework Composition Root for injecting base-state in
 * eg. sdk, browser (for ui testing) and other environment related things that
 * would cross the test-file barrier
 */
GherkinTest({ feature: './features/calculator.feature' }, ({ Scenario, Background, ScenarioOutline }) => {
  Background('Calculator')
    .Given('I can calculate', () => {
      expect(Math).toBeTruthy();
    });

  Scenario('A simple addition test')
    .Given('I have the following numbers:', (state = {}, table: IGherkinTableParam) => {
      const [{ a, b }] = table.rows.mapByTop();

      return {
        ...state,
        a: parseInt(a, 10), b: parseInt(b, 10),
      };
    })
    .When('I add the numbers', addNumbers)
    .And('I do nothing', (state) => state)
    .Then('I get', (state, text: string) => {
      expect(state.c).toBe(parseInt(text, 10));

      return state;
    });

  Scenario('A simple multiplication test')
    .Given(/^I have numbers (\d+) and (\d+)$/, getNumbers)
    .When('I multiply the numbers', multiplyNumbers)
    .Then('I get {int}', checkResult);

  ScenarioOutline('A simple subtraction test')
    .Given('I have numbers {int} and {int}', getNumbers)
    .When('I subtract the numbers', addNumbers)
    .Then('I get {int}', checkResult);
});
