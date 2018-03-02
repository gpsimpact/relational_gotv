export default `
  enum RegistrantPrefixEnum {
    mr
    mrs
    miss
    ms
  }

  enum RegistrantSuffixEnum {
    jr
    sr
    ii
    iii
    iv
  }

  input RegistrationInput {
    # unique id in uuid4 format
    id: String
    attest_citizen: Boolean
    attest_eighteen_plus: Boolean
    prefix: RegistrantPrefixEnum
    suffix: RegistrantSuffixEnum
    name_first: String
    name_last: String
    name_middle: String
    address_home: String
    address_apt_lot: String
    address_city_town: String
    address_state: String
    address_zipcode: String
    mail_address: String
    mail_address_city_town: String
    mail_address_state: String
    mail_address_zipcode: String
    # YYYY-mm-dd
    dob: String
    telephone: String
    id_number: String
    party: String
    race_ethnic: String
    # YYYY-mm-dd
    date_signed: String
    # base 64 data uri png format
    signature_path: String
    previous_prefix: RegistrantPrefixEnum
    previous_suffix: RegistrantSuffixEnum
    previous_name_first: String
    previous_name_last: String
    previous_name_middle: String
    previous_address_home: String
    previous_address_apt_lot: String
    previous_address_city_town: String
    previous_address_state: String
    previous_address_zipcode: String
    helper: String
    # free form place to record reason for update
    most_recent_update_label: String
  }

  type RegistrantProfile {
    # unique id in uuid4 format
    id: String
    attest_citizen: Boolean
    attest_eighteen_plus: Boolean
    prefix: RegistrantPrefixEnum
    suffix: RegistrantSuffixEnum
    name_first: String
    name_last: String
    name_middle: String
    address_home: String
    address_apt_lot: String
    address_city_town: String
    address_state: String
    address_zipcode: String
    mail_address: String
    mail_address_city_town: String
    mail_address_state: String
    mail_address_zipcode: String
    # YYYY-mm-dd
    dob: String
    telephone: String
    id_number: String
    party: String
    race_ethnic: String
    # YYYY-mm-dd
    date_signed: String
    # base 64 data uri png format
    signature_path: String
    previous_prefix: RegistrantPrefixEnum
    previous_suffix: RegistrantSuffixEnum
    previous_name_first: String
    previous_name_last: String
    previous_name_middle: String
    previous_address_home: String
    previous_address_apt_lot: String
    previous_address_city_town: String
    previous_address_state: String
    previous_address_zipcode: String
    helper: String
    # optional label for most recent mutation
    most_recent_update_label: String
  }

  type Mutation {
    updateRegistrant(data: RegistrationInput): RegistrantProfile
  }
`;
