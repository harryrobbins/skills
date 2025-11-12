/**
 * Page Layout Example with GOV.UK React
 *
 * This example demonstrates proper page structure including:
 * - Header with service name and navigation
 * - Breadcrumbs
 * - Grid system for responsive layout
 * - Main content area
 * - Sidebar with related content
 * - Footer with links
 * - Phase banner
 * - Skip link for accessibility
 */

import React from 'react'
import {
  GlobalStyle,
  Page,
  SkipLink,
  PhaseBanner,
  Breadcrumbs,
  GridRow,
  GridCol,
  Heading,
  Paragraph,
  LeadParagraph,
  Link,
  RelatedItems,
  UnorderedList,
  ListItem,
  InsetText,
  Details,
  Button,
  TopNav
} from 'govuk-react'

function PageLayoutExample() {
  return (
    <>
      <GlobalStyle />

      {/* Skip link for accessibility - allows keyboard users to jump to main content */}
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>

      {/* Header with service name and navigation */}
      <TopNav serviceTitle="Apply for a Provisional Licence">
        <TopNav.Item href="/dashboard">Dashboard</TopNav.Item>
        <TopNav.Item href="/applications">My applications</TopNav.Item>
        <TopNav.Item href="/account">Account</TopNav.Item>
      </TopNav>

      {/* Phase banner - indicates service is in beta */}
      <PhaseBanner level="beta">
        This is a new service – your{' '}
        <Link href="/feedback" muted>
          feedback
        </Link>{' '}
        will help us to improve it.
      </PhaseBanner>

      {/* Breadcrumb navigation */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 15px' }}>
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          <Breadcrumbs.Link href="/transport">Transport</Breadcrumbs.Link>
          <Breadcrumbs.Link href="/transport/driving">
            Driving and transport
          </Breadcrumbs.Link>
          <Breadcrumbs.Link>Apply for a provisional licence</Breadcrumbs.Link>
        </Breadcrumbs>

        {/* Main content area */}
        <main id="main-content" role="main">
          <GridRow>
            {/* Main column - two-thirds width on desktop */}
            <GridCol
              setWidth="full"
              setTabletWidth="full"
              setDesktopWidth="two-thirds"
            >
              {/* Page heading */}
              <Heading size="XLARGE">
                Apply for your first provisional driving licence
              </Heading>

              {/* Lead paragraph - introductory text */}
              <LeadParagraph>
                You can apply for a provisional driving licence when you're 15 years
                and 9 months old. You can start driving a car when you're 17.
              </LeadParagraph>

              {/* Important information box */}
              <InsetText>
                You must be able to read a number plate from 20 metres away to get a
                provisional driving licence.
              </InsetText>

              {/* Section: What you need */}
              <Heading size="LARGE">What you need</Heading>

              <Paragraph>To apply online you'll need:</Paragraph>

              <UnorderedList>
                <ListItem>
                  a valid UK passport or other form of identity
                </ListItem>
                <ListItem>
                  addresses where you've lived for the last 3 years
                </ListItem>
                <ListItem>
                  your National Insurance number (if you know it)
                </ListItem>
                <ListItem>to pay £34 by debit or credit card</ListItem>
              </UnorderedList>

              <Paragraph>
                You'll also need to be able to read a number plate from 20 metres
                away.
              </Paragraph>

              {/* Expandable help section */}
              <Details summary="If you do not have a UK passport">
                <Paragraph>
                  You can still apply for a provisional driving licence if you have
                  a different form of identity. You'll need to send your identity
                  documents by post as part of your application.
                </Paragraph>
                <Paragraph>
                  Accepted documents include:
                </Paragraph>
                <UnorderedList>
                  <ListItem>Birth certificate</ListItem>
                  <ListItem>
                    Travel document (biometric residence permit or card)
                  </ListItem>
                  <ListItem>National identity card</ListItem>
                </UnorderedList>
              </Details>

              {/* Section: How to apply */}
              <Heading size="LARGE">How to apply</Heading>

              <Paragraph>
                The online service is available from 6am to 11:30pm.
              </Paragraph>

              <Paragraph>
                It takes around 20 minutes to apply for a provisional licence online.
              </Paragraph>

              <Paragraph>
                Your provisional licence should arrive within 1 week if you apply
                online. It may take longer if DVLA need to check your information.
              </Paragraph>

              {/* Call to action button */}
              <Button variant="primary" isStartButton>
                Start now
              </Button>

              {/* Section: Other ways to apply */}
              <Heading size="MEDIUM">Other ways to apply</Heading>

              <Paragraph>
                You can also apply for a provisional driving licence by post. Get
                form D1 from the{' '}
                <Link href="https://www.gov.uk/government/organisations/driver-and-vehicle-licensing-agency">
                  DVLA form ordering service
                </Link>{' '}
                or you can pick one up from a Post Office.
              </Paragraph>

              <Paragraph>
                Send your completed form and documents to DVLA, Swansea, SA99 1AD.
              </Paragraph>

              <Paragraph>
                It usually takes 3 weeks to get your licence. It might take longer if
                DVLA need to make additional checks.
              </Paragraph>

              {/* Section: After you apply */}
              <Heading size="LARGE">After you apply</Heading>

              <Paragraph>
                Once you have your provisional licence, you can:
              </Paragraph>

              <UnorderedList>
                <ListItem>
                  <Link href="/book-theory-test">book your theory test</Link>
                </ListItem>
                <ListItem>
                  <Link href="/find-driving-instructor">
                    find a driving instructor
                  </Link>
                </ListItem>
                <ListItem>
                  <Link href="/learning-to-drive">start learning to drive</Link>
                </ListItem>
              </UnorderedList>

              <Details summary="Driving lessons and practice">
                <Paragraph>
                  You can take driving lessons with a qualified instructor before you
                  get your provisional licence, but you cannot practice on the road.
                </Paragraph>
                <Paragraph>
                  When practicing, make sure you're with someone who:
                </Paragraph>
                <UnorderedList>
                  <ListItem>is 21 or over</ListItem>
                  <ListItem>
                    has had their full driving licence for at least 3 years
                  </ListItem>
                </UnorderedList>
              </Details>
            </GridCol>

            {/* Sidebar column - one-third width on desktop */}
            <GridCol
              setWidth="full"
              setTabletWidth="full"
              setDesktopWidth="one-third"
            >
              {/* Related content section */}
              <RelatedItems>
                <Heading size="MEDIUM">Related content</Heading>

                <UnorderedList>
                  <ListItem>
                    <Link href="/theory-test">The theory test</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/practical-test">The practical driving test</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/driving-lessons">
                      Taking driving lessons and practice
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/learning-disabilities">
                      Driving lessons if you have a learning disability
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/driving-instructors">
                      Find approved driving instructors
                    </Link>
                  </ListItem>
                </UnorderedList>

                <Heading size="SMALL">Explore the topic</Heading>

                <UnorderedList>
                  <ListItem>
                    <Link href="/driving-licences">Driving licences</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/learning-to-drive">Learning to drive</Link>
                  </ListItem>
                </UnorderedList>
              </RelatedItems>
            </GridCol>
          </GridRow>
        </main>

        {/* Footer */}
        <Page.Footer
          meta={
            <>
              <Link href="/help">Help</Link>
              <Link href="/cookies">Cookies</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/terms">Terms and conditions</Link>
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/accessibility">Accessibility statement</Link>
            </>
          }
        >
          <div style={{ marginBottom: '20px' }}>
            <Heading size="MEDIUM">Services and information</Heading>
            <GridRow>
              <GridCol setWidth="one-half">
                <UnorderedList>
                  <ListItem>
                    <Link href="/benefits">Benefits</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/births-deaths-marriages">
                      Births, deaths, marriages and care
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/business">Business and self-employed</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/childcare">Childcare and parenting</Link>
                  </ListItem>
                </UnorderedList>
              </GridCol>
              <GridCol setWidth="one-half">
                <UnorderedList>
                  <ListItem>
                    <Link href="/citizenship">Citizenship and living in the UK</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/crime-justice">Crime, justice and the law</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/disabled">Disabled people</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="/driving">Driving and transport</Link>
                  </ListItem>
                </UnorderedList>
              </GridCol>
            </GridRow>
          </div>
        </Page.Footer>
      </div>
    </>
  )
}

export default PageLayoutExample
