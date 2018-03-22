export default {
  form_schema: {
    formTitle: 'First Example task',
    submitButtonText: 'Complete',
    fields: [
      {
        widget: 'p',
        text:
          'This is an example of a task that we ask the volunteer to perform to mobilize a voter. A task can be any combination of instructions, inputs and dropdowns. In this example we might ask a question.',
      },
      {
        widget: 'p',
        text:
          'Please contact this voter and ask them the following question. Enter their responses below.',
      },
      {
        id: 'favColor',
        type: 'text',
        widget: 'textinput',
        validationType: 'string',
        label: 'What is your favorite Color?',
        placeholder: 'Enter a color name',
        validationTests: [
          {
            method: 'required',
            message: 'Color is required',
          },
          {
            method: 'min',
            value: 2,
            message: 'must have length greater than 2',
          },
        ],
        initialValue: '',
      },
    ],
  },
  point_value: 10,
  status: 'INCOMPLETE',
  sequence: 1,
};
