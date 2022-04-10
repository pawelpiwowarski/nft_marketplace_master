import { conforms } from 'lodash'
import React from 'react'
import { Pagination } from 'semantic-ui-react'

const Pagination_example = (props) => (
  <Pagination
    defaultActivePage={1}
    totalPages={Math.ceil(props.num/6)}

    onPageChange={(event, data) => {  props.callback(data)}}
  />

)

export default Pagination_example