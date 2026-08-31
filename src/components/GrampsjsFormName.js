/*
element for editing a name
*/

import {html, css, LitElement} from 'lit'
import '@material/mwc-textfield'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/select/filled-select'
import '@material/web/select/select-option'

import {
  mdiArrowDown,
  mdiArrowUp,
  mdiDelete,
  mdiDotsHorizontal,
  mdiPlus,
} from '@mdi/js'

import {classMap} from 'lit/directives/class-map.js'
import {sharedStyles, iconButtonColorStyles} from '../SharedStyles.js'
import {fireEvent} from '../util.js'
import './GrampsjsIcon.js'
import './GrampsjsFormString.js'
import './GrampsjsFormSurname.js'
import {GrampsjsAppStateMixin} from '../mixins/GrampsjsAppStateMixin.js'

export class GrampsjsFormName extends GrampsjsAppStateMixin(LitElement) {
  static get styles() {
    return [
      sharedStyles,
      iconButtonColorStyles,
      css`
        mwc-textfield.fullwidth {
          width: 100%;
        }

        .clear {
          clear: both;
          margin-bottom: 2.5em;
        }

        .hide {
          display: none;
        }

        md-icon-button {
          --grampsjs-icon-button-color: var(--grampsjs-body-font-color-50);
        }

        /* .edit sets color, which does not reach the slotted icon */
        md-icon-button.edit {
          --grampsjs-icon-button-color: var(--mdc-theme-secondary);
        }
      `,
    ]
  }

  static get properties() {
    return {
      data: {type: Object},
      showMore: {type: Boolean},
      loadingTypes: {type: Boolean},
      types: {type: Object},
      typesLocale: {type: Object},
      origintype: {type: Boolean},
      _nameFormats: {type: Array},
    }
  }

  constructor() {
    super()
    this.data = {_class: 'Name'}
    this.showMore = false
    this.types = {}
    this.typesLocale = {}
    this.loadingTypes = false
    this.origintype = false
    this._nameFormats = []
  }

  render() {
    return html`
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="title"
          value="${this.data.title || ''}"
          label="${this._('Title')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <md-filled-select
          id="display-as"
          label="${this._('Display as')}"
          @change="${this._handleDisplayAsChanged}"
        >
          <md-select-option value="0" ?selected="${!this.data.display_as}"
            >${this._('Default')}</md-select-option
          >
          ${this._nameFormats.map(
            format => html`
              <md-select-option
                value="${format.number}"
                ?selected="${format.number === this.data.display_as}"
                >${format.name}</md-select-option
              >
            `
          )}
        </md-filled-select>
      </p>
      <p>
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="first_name"
          value="${this.data.first_name || ''}"
          label="${this._('Given name')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="suffix"
          value="${this.data.suffix || ''}"
          label="${this._('Suffix')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="call"
          value="${this.data.call || ''}"
          label="${this._('Call name')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="nick"
          value="${this.data.nick || ''}"
          label="${this._('Nick name')}"
        ></grampsjs-form-string>
      </p>
      <p class="${classMap({hide: !this.showMore})}">
        <grampsjs-form-string
          @formdata:changed="${this._handleFormData}"
          fullwidth
          id="famnick"
          value="${this.data.famnick || ''}"
          label="${this._('Family nick name')}"
        ></grampsjs-form-string>
      </p>

      <div class="clear"></div>

      <h4 class="label ${classMap({hide: !this.showMore})}">
        ${this._('Surnames')}
      </h4>
      ${(this.data.surname_list || [{}]).map(
        (obj, i) => html`
          <md-icon-button
            ?disabled="${!this.data?.surname_list ||
            this.data?.surname_list?.length === 1}"
            class="edit ${classMap({hide: !this.showMore})}"
            aria-label="${this._('Delete')}"
            @click="${() => this._handleDeleteSurname(i)}"
          >
            <grampsjs-icon path="${mdiDelete}" color="currentColor">
            </grampsjs-icon>
          </md-icon-button>

          <md-icon-button
            ?disabled="${!this.data?.surname_list || i === 0}"
            class="edit ${classMap({hide: !this.showMore})}"
            aria-label="${this._('Move Up')}"
            @click="${() => this._handleUpSurname(i)}"
          >
            <grampsjs-icon path="${mdiArrowUp}" color="currentColor">
            </grampsjs-icon>
          </md-icon-button>

          <md-icon-button
            ?disabled="${!this.data?.surname_list ||
            i === this.data?.surname_list?.length - 1}"
            class="edit ${classMap({hide: !this.showMore})}"
            aria-label="${this._('Move Down')}"
            @click="${() => this._handleDownSurname(i)}"
          >
            <grampsjs-icon path="${mdiArrowDown}" color="currentColor">
            </grampsjs-icon>
          </md-icon-button>

          <grampsjs-form-surname
            ?origintype="${this.origintype}"
            ?showMore="${this.showMore}"
            id="surnames${i}"
            idx="${i}"
            @formdata:changed="${this._handleFormData}"
            .appState="${this.appState}"
            .data="${obj}"
            .types="${this.types}"
            ?loadingTypes=${this.loadingTypes}
            .typesLocale="${this.typesLocale}"
          >
          </grampsjs-form-surname>
          <hr />
        `
      )}
      <p class="${classMap({hide: !this.showMore})}">
        <md-icon-button
          aria-label="${this._('Add')}"
          @click="${this._handleAddSurname}"
        >
          <grampsjs-icon path="${mdiPlus}" color="currentColor">
          </grampsjs-icon>
        </md-icon-button>
      </p>

      ${this.showMore
        ? ''
        : html`
            <md-icon-button
              class="edit"
              id="button-show-more"
              aria-label="${this._('Show more')}"
              @click="${this._handleShowMore}"
            >
              <grampsjs-icon path="${mdiDotsHorizontal}" color="currentColor">
              </grampsjs-icon>
            </md-icon-button>
            <grampsjs-tooltip
              for="button-show-more"
              .appState="${this.appState}"
              >${this._('Show more')}</grampsjs-tooltip
            >
          `}
    `
  }

  _handleShowMore() {
    this.showMore = true
  }

  reset() {
    this.shadowRoot
      .querySelectorAll('grampsjs-form-string')
      .forEach(element => element.reset())
    this.shadowRoot.querySelector('grampsjs-form-surname').reset()
    this.showMore = false
    this.data = {_class: 'Name'}
  }

  handleChange() {
    fireEvent(this, 'formdata:changed', {data: this.data})
  }

  _handleAddSurname() {
    this.data = {
      ...this.data,
      surname_list: [...(this.data.surname_list || [{}]), {}],
    }
  }

  _handleDeleteSurname(i) {
    this.data.surname_list.splice(i, 1)
    this.data = {
      ...this.data,
      surname_list: [...this.data.surname_list],
    }
  }

  _handleUpSurname(i) {
    this.data = {
      ...this.data,
      surname_list: [...this.moveItem(this.data.surname_list, i, i - 1)],
    }
  }

  _handleDownSurname(i) {
    this.data = {
      ...this.data,
      surname_list: [...this.moveItem(this.data.surname_list, i, i + 1)],
    }
  }

  firstUpdated() {
    this._fetchNameFormats()
  }

  async _fetchNameFormats() {
    const data = await this.appState.apiGet('/api/name-formats/')
    if ('data' in data) {
      // Number 0 is the default entry, which this form offers on its own.
      this._nameFormats = data.data.filter(
        format => format.active && format.number !== 0
      )
    }
  }

  _handleDisplayAsChanged(e) {
    // Gramps stores the format as a number, and 0 means no override.
    this.data = {...this.data, display_as: Number(e.target.value)}
    this.handleChange()
  }

  _handleFormData(e) {
    const originalTarget = e.composedPath()[0]
    if (
      ['first_name', 'call', 'nick', 'famnick', 'title', 'suffix'].includes(
        originalTarget.id
      )
    ) {
      this.data = {...this.data, [originalTarget.id]: e.detail.data}
    } else if (originalTarget.id.startsWith('surnames')) {
      const i = e.detail.idx
      const surnameList = this.data.surname_list || []
      this.data = {
        ...this.data,
        surname_list: [
          ...surnameList.slice(0, i),
          e.detail.data,
          ...surnameList.slice(i + 1),
        ],
      }
    }
    e.stopPropagation()
    this.handleChange()
  }

  moveItem = (array, from, to) => {
    const item = array[from]
    array.splice(from, 1)
    array.splice(to, 0, item)
    return array
  }
}

window.customElements.define('grampsjs-form-name', GrampsjsFormName)
