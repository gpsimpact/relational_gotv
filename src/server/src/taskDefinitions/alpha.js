export default {
  form_schema: {
    formTitle: 'First Example task',
    submitButtonText: 'Complete',
    fields: [
      {
        widget: 'markdown',
        content: '# This is a header\n\nAnd this is a paragraph',
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
