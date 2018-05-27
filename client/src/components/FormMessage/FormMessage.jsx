import React from 'react';

import {Message} from 'semantic-ui-react';

const FormMessage = ({type, header, content}) =>
  <Message
    error={type === 'error'}
    warning={type === 'warning'}
    success={type === 'succes'}
    header={header}
    content={content}
  />;

export default FormMessage;
