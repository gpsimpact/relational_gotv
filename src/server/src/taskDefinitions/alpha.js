export default {
  form_schema: {
    formTitle: 'This is Color task',
    submitButtonText: 'Mark as completed!',
    fields: [
      {
        widget: 'p',
        text: 'Contact this person and ask this very important question.',
      },
      {
        id: 'favColor',
        type: 'text',
        widget: 'textinput',
        validationType: 'string',
        label: 'What is their favorite Color?',
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
