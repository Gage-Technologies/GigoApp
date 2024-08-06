// function to determine the progression level based on the type and value
const DetermineProgressionLevel = (
  progression_type: string,
  progression_value: string,
): [string, string, string] => {
  // parse the progression value to a float
  const value = parseFloat(progression_value || '0');

  // switch statement to handle different progression types
  switch (progression_type) {
    case 'data_hog':
      if (value < 10000) {
        return ['Level 1', '10000', '0'];
      } else if (value < 50000) {
        return ['Level 2', '50000', '10000'];
      } else {
        return ['Level 3', '100000', '50000'];
      }

    case 'hungry_learner':
      if (value < 5) {
        return ['Level 1', '5', '0'];
      } else if (value < 10) {
        return ['Level 2', '10', '5'];
      } else {
        return ['Level 3', '20', '10'];
      }

    case 'man_of_the_inside':
      if (value < 10) {
        return ['Level 1', '10', '0'];
      } else if (value < 50) {
        return ['Level 2', '50', '10'];
      } else {
        return ['Level 3', '100', '50'];
      }

    case 'scribe':
      if (value < 50) {
        return ['Level 1', '50', '0'];
      } else if (value < 100) {
        return ['Level 2', '100', '50'];
      } else {
        return ['Level 3', '250', '100'];
      }

    case 'tenacious':
      if (value < 5) {
        return ['Level 1', '5', '0'];
      } else if (value < 10) {
        return ['Level 2', '10', '5'];
      } else {
        return ['Level 3', '15', '10'];
      }

    case 'unit_mastery':
      if (value < 1) {
        return ['Level 1', '1', '0'];
      } else if (value < 3) {
        return ['Level 2', '3', '1'];
      } else {
        return ['Level 3', '5', '3'];
      }

    // default case to handle unknown progression types
    default:
      return ['Level 1', '1', '0'];
  }
};

// export the function as the default export
export default DetermineProgressionLevel;
