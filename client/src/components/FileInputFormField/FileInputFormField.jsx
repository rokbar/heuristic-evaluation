import React, {Component} from 'react';
import {forEach, map, filter} from 'lodash';

import {Image, Modal, Icon, Card} from 'semantic-ui-react';

class FileInputFormField extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const {input: {onChange}} = this.props;
    const files = e.target.files;
    const base64Files = [];

    forEach(files, (file => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        base64Files.push({uri: reader.result});
      }, false);
    }));

    this.setState({
      photos: base64Files.map(item => item.uri),
    });
    onChange([...base64Files]);
  }

  removePhoto({ id }) {
    const {input: {onChange, value}} = this.props;
    const mappedPhotos = map(value, (item) => (item.id === id ? { ...item, removed: true } : item));
    const filteredPhotos = filter(mappedPhotos, (item) => (item.id !== id || !item.uri));

    onChange([...filteredPhotos]);
  }

  render() {
    const {input: {value}} = this.props;
    const notRemovedPhotos = filter(value, (item) => !item.removed);
    return [
      <input
        type="file"
        value={null}
        onChange={this.onChange}
        multiple
      />,
      <div style={{display: 'flex'}}>
        {map(notRemovedPhotos, (item) => <div style={{display: 'flex', margin: '10px'}}>
            <Modal
              trigger={
                <Image style={{cursor: 'pointer', height: '100px', width: 'auto'}} src={item.path}/>
              }
            >
              <Image src={item.path}/>
            </Modal>
            <Icon
              onClick={() => this.removePhoto({ ...item })}
              name="trash outline"
              size="large"
              color="red"
              style={{float: 'right'}}
            />
          </div>
        )}
      </div>
    ];
  }
}

export default FileInputFormField;
