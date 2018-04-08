import React, {Component} from 'react';
import {forEach, map, filter, uniqBy} from 'lodash';

import {Image, Modal, Icon, Button} from 'semantic-ui-react';

import './FileInputFormField.css';

class FileInputFormField extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  async onChange(e) {
    const {input: {onChange, value}} = this.props;
    const files = e.target.files;

    const base64Files = await this.loadPhotos(files);

    const uniqueBase64Files = uniqBy([...base64Files], 'name');
    const mergedIntoExistingPhotos = value ? [ ...value, ...uniqueBase64Files ] : [ ...uniqueBase64Files ];
    onChange([...mergedIntoExistingPhotos]);
  }

  loadPhotos(files) {
    let promises = [];

    forEach(files, (file => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      promises.push(
        new Promise((resolve, reject) => {
          reader.addEventListener('load', () => {
            resolve({uri: reader.result, name: file.name});
          }, false);
        })
      )
    }));

    return Promise.all(promises)
      .then(photos => photos)
      .catch(err => console.log(err));
  }

  removePhoto({ id, name }) {
    const {input: {onChange, value}} = this.props;
    const photosToRemove = map(value, (item) => (item.id && item.id === id ? { ...item, removed: true } : item));
    const filteredPhotos = filter(photosToRemove, (item) => (!name || item.name !== name));

    onChange([...filteredPhotos]);
  }

  render() {
    const {input: {value}} = this.props;
    const notRemovedPhotos = filter(value, (item) => !item.removed);
    return [
      <div className="PhotoInsertButton">
        <input
          type="file"
          id="file"
          name="file"
          className="PhotoInput"
          onChange={this.onChange}
          multiple
        />
        <Button basic color="green" as="label" for="file">
          <Icon name="image" /> Pridėti nuotraukas
        </Button>
      </div>,
      <div style={{display: 'flex'}}>
        {map(notRemovedPhotos, (item, key) => <div key={key} style={{display: 'flex', margin: '10px'}}>
            <Modal
              trigger={
                <Image style={{cursor: 'pointer', height: '100px', width: 'auto'}} src={item.path || item.uri}/>
              }
            >
              <Image style={{margin: 'auto' }} src={item.path || item.uri}/>
            </Modal>
            <Icon
              onClick={() => this.removePhoto({ ...item })}
              name="trash outline"
              size="large"
              color="red"
              style={{float: 'right'}}
              link
            />
          </div>
        )}
      </div>
    ];
  }
}

export default FileInputFormField;
