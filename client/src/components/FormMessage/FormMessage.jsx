import React from 'react';

import {Message} from 'semantic-ui-react';

const FormMessage = ({type, header, content, ...restProps}) =>
  <Message
    error={type === 'error'}
    warning={type === 'warning'}
    success={type === 'success'}
    header={header}
    content={content}
    {...restProps}
  />;

export default FormMessage;
