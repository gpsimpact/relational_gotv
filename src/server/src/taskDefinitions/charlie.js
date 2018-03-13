export default {
  form_schema: {
    formTitle: 'This is a Select task',
    submitButtonText: 'Mark as completed!',
    fields: [
      {
        widget: 'p',
        text: 'Which one of these options do you prefer?',
      },
      {
        id: 'favBluth',
        widget: 'select',
        validationType: 'string',
        label: 'This is a Select example. Pick one.',
        options: [
          { value: '', label: 'select one' },
          { value: 'choiceOne', label: 'choiceOne' },
          { value: 'choiceTwo', label: 'choiceTwo' },
          { value: 'choiceThree', label: 'choiceThree' },
        ],
        initialValue: '',
        validationTests: [
          {
            method: 'required',
            message: 'A choice is required',
          },
          {
            method: 'min',
            value: 2,
            message: 'A choice is required',
          },
        ],
      },
    ],
  },
  point_value: 10,
  status: 'INCOMPLETE',
  sequence: 2,
};
