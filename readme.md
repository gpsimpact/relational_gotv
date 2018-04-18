#Relational gotv project

This project is made possible with generous support from The Mainstream Coalition. https://www.mainstreamcoalition.org/


##To run locally:
* Install / configure nanobox client http://nanobox.io
* duplicate example.env to .env and customize
* load environmental variables with `nanobox evar load local .env`
* run `nanobox run` from within the project directory
* run `yarn dev` to start dev server of both client(react) and api server


##Features:
* Partnering organizations each have a profile page to encourage users to register:
![Org Profile](http://client-static-assets.s3.amazonaws.com/rgotv/org_profile.png)
* Users can easily add their lists of friends / contacts whom they are going to GOTV
![Contact List](http://client-static-assets.s3.amazonaws.com/rgotv/add_contacts.png)
* User can match their friends to the voter file
![Voter File Match](http://client-static-assets.s3.amazonaws.com/rgotv/match_to_voter_file.png)
* Monitor Voted status and vote by mail status
![Voted dialogue](http://client-static-assets.s3.amazonaws.com/rgotv/voted.png)
![VBM dialogue](http://client-static-assets.s3.amazonaws.com/rgotv/vbm.png)
* Users can be assigned tasks to complete for each contact and earn points
![Tasks](http://client-static-assets.s3.amazonaws.com/rgotv/tasks.png)

Tasks are defined by a simple schema:
```
{
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
```