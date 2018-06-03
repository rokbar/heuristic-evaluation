import React from 'react';

import {Popup, Icon, Rating, Header} from 'semantic-ui-react';

export default function RatingsMeaningPopup(props) {
  return <Popup
    position="bottom right"
    trigger={<Icon color="teal" name="question circle" size="large"/>}
    wide="very"
  >
    <Header as="h4">Aktualumo įverčių paaiškinimas</Header>
    <div><Rating defaultRating={0} maxRating={4} disabled/> - Manau, tai nėra problema</div>
    <div><Rating defaultRating={1} maxRating={4} disabled/> - Kosmetinis trūkumas; taisyti esant laiko pertekliui</div>
    <div><Rating defaultRating={2} maxRating={4} disabled/> - Smulkus trūkumas; taisyti, tačiau prioritetas žemas</div>
    <div><Rating defaultRating={3} maxRating={4} disabled/> - Rimtas trūkumas; svarbu pataisyti</div>
    <div><Rating defaultRating={4} maxRating={4} disabled/> - Sistemai pražūtingas trūkumas; būtina pataisyti</div>
  </Popup>
}
