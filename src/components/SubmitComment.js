// @format
import g, { Div, Form, Input, Label, Legend, Textarea, Span } from 'glamorous'
import { css } from 'glamor'
import React from 'react'
import Helmet from 'react-helmet'
import gray from 'gray-percentage'
import { rhythm } from '../utils/typography'
import { heroColor } from '../utils/colors.js'
import StyledButton from './StyledButton.js'

// TODO: Move the reCapcha into a separate component.
// TODO: Get reCaptcha siteKey and secret from staticman.yml instead.
// TODO: Use a GraphQL Fragment

const textBoxCss = css({
  '::placeholder': {
    color: heroColor.darken(0.7).string(),
    fontStyle: 'italic',
  },
  padding: `0 ${rhythm(1 / 4)}`,
})

const FormOption = props => {
  const optParts = props.option.split('.')
  const name = `options[${optParts.join('][]')}]`
  return <Input name={name} value={props.value} type="hidden" />
}

const StyledLabel = g.label(props => {
  let styles = [
    {
      ':focus': {
        background: heroColor.string(),
      },
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      margin: '1em 0',
    },
  ]

  styles.push(props['css'])

  return styles
})

const StyledLabelDiv = g.label(props => {
  let styles = [
    {
      display: 'inline-block',
      flex: '0 0 30%',
    },
  ]

  styles.push(props['css'])

  return styles
})

const Labelled = props => {
  let requiredText = ''

  if (!props.required) {
    requiredText = (
      <Span
        css={{
          color: heroColor.darken(0.5).string(),
          fontStyle: 'italic',
        }}
      >
        (optional)
      </Span>
    )
  }

  return (
    <StyledLabel css={props['labelCss']}>
      <StyledLabelDiv css={props['divCss']}>
        {props.label}
        {requiredText}
      </StyledLabelDiv>
      {props.children}
    </StyledLabel>
  )
}

const LabelledInput = props => {
  return (
    <Labelled label={props.label} required={props.required}>
      <Input
        css={{
          flex: '0 0 70%',
        }}
        {...textBoxCss}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
      />
    </Labelled>
  )
}

const ReCaptcha = () => {
  return null
  const siteKey = '6LeIP0oUAAAAANRB2QX0a3ItZkkiBJsmEs9pel4P'
  const secret =
    'HxjRkHBC9KGoa7rBLWS5L6mmWcIem/aJewy+hvao4gwXNengRVD+Xgjqffkt1JSzVr20wGWc1kG6RDx8' +
    'y79kUyLGfcrUDro127Hvi+U7A8gnE4snDsXeYUPTnTxR0nbUqO4PmUApmNZf54IOtOyHZHmTFdV19/dv' +
    'qJopL1jhByo='
  return (
    <Div>
      <Helmet>
        <script src="https://www.google.com/recaptcha/api.js" />
      </Helmet>
      <Div className="g-recaptcha" data-sitekey={siteKey} />
      <FormOption option="reCaptcha.siteKey" value={siteKey} />
      <FormOption option="reCaptcha.secret" value={secret} />
    </Div>
  )
}

class SubmitComment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }
  }
  toggleForm() {
    if (this.props.closeSection) {
      this.props.onCloseSectionClick && this.props.onCloseSectionClick()
    } else {
      this.setState({
        isOpen: !this.state.isOpen,
      })
    }
  }
  render() {
    const formUrl =
      'https://api.staticman.net/v2/entry/docwhat/docwhat/master/comments'
    const returnUrl = this.props.url
    const slug = this.props.slug
    const slugdir = slug.replace(/^\/+|\/+$/g, '')

    return (
      <Form method="POST" action={formUrl}>
        <Legend
          css={{
            ':hover': {
              textDecoration: 'underline',
            },
            cursor: 'pointer',
            flex: '0 0 100%',
            fontSize: rhythm(1),
          }}
          onClick={this.toggleForm.bind(this)}
        >
          Submit a Comment{' '}
          <div
            css={{
              margin: '0 0.5em',
              display: 'inline-block',
              transform: !this.state.isOpen ? 'rotate(-90deg)' : null,
            }}
          >
            ▼
          </div>
        </Legend>
        {this.state.isOpen ? (
          <div>
            <FormOption option="redirect" value={returnUrl} />
            <FormOption option="slug" value={slug} />
            <FormOption option="slugdir" value={slugdir} />

            <LabelledInput
              label="Name"
              name="fields[name]"
              type="text"
              placeholder="Joe Cool"
              required
            />

            <LabelledInput
              label="E-mail"
              name="fields[email]"
              type="email"
              placeholder="joe.cool@example.com"
              required
            />

            <LabelledInput
              label="Website"
              name="fields[url]"
              type="url"
              placeholder="http://joecool.example.com/"
            />

            <Labelled label="Message" required>
              <Textarea
                name="fields[message]"
                placeholder="Type your message. You can use **Markdown**!"
                css={{
                  flex: '0 1 70%',
                  height: rhythm(5),
                  minWidth: rhythm(10),
                  width: '100%',
                }}
                {...textBoxCss}
              />
            </Labelled>

            <Labelled
              label="I want to be notified of new comments"
              divCss={{
                display: 'inline-block',
                flex: '1 0 80%',
              }}
              required
            >
              <Div
                css={{
                  flex: '0 1 20%',
                  textAlign: 'right',
                }}
              >
                <Input type="checkbox" name="options[subscribe]" css={{}} />
              </Div>
            </Labelled>

            <ReCaptcha />

            <Div
              css={{
                textAlign: 'right',
              }}
            >
              <StyledButton>Comment</StyledButton>
            </Div>
          </div>
        ) : null}
      </Form>
    )
  }
}

export default SubmitComment
