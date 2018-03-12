export default {
  form_schema: {
    formTitle: 'This is Bluth task',
    submitButtonText: 'Mark as completed!',
    fields: [
      {
        widget: 'p',
        text: 'George Sr? Michael? George Michael? GOB? Buster? Who is their favorite Bluth?',
      },
      {
        id: 'favBluth',
        type: 'text',
        widget: 'textinput',
        validationType: 'string',
        label: 'What is their favorite Bluth?',
        placeholder: 'Lucille? Loose Seal?',
        validationTests: [
          {
            method: 'required',
            message: 'Bluth is required',
          },
          {
            method: 'min',
            value: 2,
            message: 'must have length greater than 5',
          },
        ],
        initialValue: '',
      },
    ],
  },
  point_value: 10,
  status: 'INCOMPLETE',
  sequence: 2,
};
