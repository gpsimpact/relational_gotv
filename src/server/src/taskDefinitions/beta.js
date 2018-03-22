export default {
  form_schema: {
    formTitle: 'This is Second Task',
    submitButtonText: 'Mark as completed!',
    fields: [
      {
        widget: 'p',
        text: 'This is a task that illustrates multiple questions in one task. Both are required.',
      },
      {
        widget: 'p',
        text:
          'Please contact this voter and ask them the following questions. Type their input below.',
      },
      {
        id: 'favBluth',
        type: 'text',
        widget: 'textinput',
        validationType: 'string',
        label: 'Who is your favorite character from the TV series Arrested Development?',
        placeholder: 'Lucille? Loose Seal?',
        validationTests: [
          {
            method: 'required',
            message: 'A Bluth is required',
          },
          {
            method: 'min',
            value: 2,
            message: 'must have length greater than 5',
          },
        ],
        initialValue: '',
      },
      {
        id: 'pickOne',
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
