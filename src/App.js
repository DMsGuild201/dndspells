import React from 'react';
import styled from 'styled-components';
import { color, Spell, StyledSpell, CasterLabel } from './spell';
import Spells from './spells';
import avatar from './taurus2.jpg';

const EditModeMessage = styled.div`
    background-color: ${color.paladin};
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 0.75em;
    font-family: 'Lato', sans-serif;
    padding: 1em;
    margin-top: 1em;

    p {
        color: #222;
        margin: 0 0 1em 0;
    }
`;

function SaveButton(props) {

    return <a className={props.className} href="#" onClick={() => props.onClick()}>Save</a>;
}

const StyledSaveButton = styled(SaveButton)`
    color: #222;
    display: block;
    margin-left: 0;
    padding: 0.5em 1em;
    border: 1px solid #222;
    border-radius: 0.75em;
    text-decoration: none;

    :hover {
        color: ${color.paladin};
        background-color: #222;
    }
`;

const ResetButton = styled.a`
    flex: 0 1 auto;
    margin-left: 1em;
    border-radius: 0.75em;

    @media only screen and (min-width: 1920px) {
        display: block;
        margin-left: 0;
        padding: 0.5em 1em;
        border: 1px solid ${color.wizard};
        text-decoration: none;

        :hover {
            border: 1px solid ${color.warlock};
        }
    }
`;

function swap(spells, i1, i2) {

    return spells.map((spell, index) => {
        switch (index) {
            case i1: return {...spell, coordinates: spells[i2].coordinates};
            case i2: return {...spell, coordinates: spells[i1].coordinates};
            default: return spell;
        }
    });
}

const ResetButtonWrapper = styled.div`
    display: inline;

    @media only screen and (min-width: 1920px) {
        display: flex;
        justify-content: center;
        margin-top: 1em;
    }
`;

const Wrapper = styled.div`
    font-size: 3vw;

    @media screen and (min-width: 601px) {
        font-size: 16px;
    }

    @media screen and (min-width: 1920px) {
        display: flex;
        height: 100%;
        align-items: center;
    }
`;

const Header = styled.header`
    padding: 1.5em 1.5em 1em;
    text-align: center;

    @media screen and (min-width: 1920px) {
        flex: 1 1 20%;
    }

    h1 {
        font-size: 2em;
        margin: 0;

        @media screen and (min-width: 1920px) {
            font-size: 5em;
        }
    }

    h3 {
        font-family: 'Merriweather', serif;
        font-size: 1em;
        font-weight: normal;
        line-height: 1.7;
        color: #aaa;
        margin: 1em auto 0;
    }

    ${CasterLabel} {

        :after {
            content: 's';
        }

        :not(:last-of-type) {
            :after {
                content: 's, ';
            }
        }
    }
`;

const BoardWrapper = styled.div`
    @media screen and (min-aspect-ratio: 4/3) and (max-aspect-ratio: 3/2) {
        max-width: 55%;
        margin: 0 auto;
    }

    @media screen and (min-aspect-ratio: 3/2) and (max-width: 1919px) {
        max-width: 45%;
        margin: 0 auto;
    }

    @media screen and (min-width: 1920px) {
        flex: 1 1 50%;
    }
`;

const Board = styled.div`
    display: grid;
    grid-template-columns: repeat(19, 1fr);
    grid-gap: 0.25em;
    margin: 0.5em;

    @media screen and (min-width: 1920px) {
        grid-gap: 0.75vh;
        margin: 1.5vh;
    }
`;

const Aside = styled.aside`
    max-width: 600px;
    margin: 0 auto;
    color: #aaa;
    padding: 1em 1.5em;
    text-align: left;

    @media only screen and (min-width: 600px) {
        columns: 2 10em;
        column-gap: 1.5em;
    }

    @media screen and (min-width: 1920px) {
        flex: 1 1 20%;
    }

    @media screen and (min-width: 2560px) {

    }

    h2 {
        color: #fff;
        font-size: 1.25em;
        margin: 0 auto 1em;
        text-transform: uppercase;
    }

    p {
        font-family: 'Merriweather', serif;
        font-size: 1em;
        line-height: 1.7;
        margin: 0 auto 1em;
    }

    img {
        width: 7em;
        border-radius: 50%;
    }
`;

const Logo = styled.div`
    margin-top: 2em;
    text-align: center;
    column-span: all;
    a {
        text-decoration: none;
    }
`;

const ColumnBreakerH2 = styled.h2`
    @media only screen and (min-width: 800px) {
        break-before: column;
        margin-top: 0;
    }
`;

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            'spells': [],
            'selectedId': false,
            'highlightedCasters': [],
            'editMode': false,
            'timeSinceLastSave': 0
        };

        var currentKey=0;
        for (currentKey in Spells) {
            this.state.spells[currentKey] = Spells[currentKey];
            //console.log(this.state.spells[currentKey]);
        }

        this.state.selectedId = false;
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if (this.state.editMode) {
            this.setState({
                'timeSinceLastSave': this.state['timeSinceLastSave'] + 1000
            });
            if (this.state['timeSinceLastSave'] > 100000) {
                this.handleSave(this.state.spells);
                this.setState({
                    'timeSinceLastSave': 0
                });
                console.log('Saved');
            }
        }
    }

    handleSave(jsonData) {
        const fileData = JSON.stringify(jsonData);
        const blob = new Blob([fileData], {type: "text/plain"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'filename.json';
        link.href = url;
        link.click();
    }

    handleClick(i) {
        if (this.state.editMode) {
            if (this.state.selectedId === i) {
                this.setState({'selectedId': false});
                //console.log('unselected: '+i);
            } else if (this.state.selectedId) {
                //console.log('switching position of ' + this.state.selectedId + ' and ' + i);
                const { spells, selectedId } = this.state;
                this.setState({
                    spells: swap(spells, Number(i), Number(selectedId)),
                    selectedId: false
                });
            } else {
                this.setState({selectedId: i});
                //console.log('selected: ' + i);
            }
        } else {
            if (this.state.highlightedCasters === this.state.spells[i].casters) {
                this.setState({highlightedCasters: []});
            } else {
                this.setState({highlightedCasters: this.state.spells[i].casters});
            }
        }
    }

    getHighlightColors(casters) {

        return casters.filter(value => this.state.highlightedCasters.includes(value));
    }

    renderSpells() {

        return this.state.spells.map(i => <Spell
            key={i.id}
            id={i.id}
            name={i.name}
            casters={i.casters}
            additionalCasters={i.additionalCasters}
            additionalCastersShown={ this.state.highlightedCasters.length === 0 ? i.additionalCasters : []}
            level={i.level}
            selected={this.state.selectedId === i.id ? true : false}
            hasOpacity={this.state.highlightedCasters.length === 0}
            highlightColors={this.getHighlightColors(i.casters)}
            coordinates={i.coordinates}
            onClick={() => this.handleClick(i.id)}
        />);
    }

    renderButtons() {
        if (this.state.editMode) {

            return (
                <EditModeMessage>
                    <p>EDIT MODE, AUTOSAVING</p>
                    <StyledSaveButton onClick={() => this.handleSave(this.state.spells)} />
                </EditModeMessage>
            );
        }
    }

    renderTitleCasterLabels() {

        return this.state.highlightedCasters.map(caster => <CasterLabel key={caster} caster={caster}>{caster}</CasterLabel>);
    }

    renderResetButton() {
        if (this.state.highlightedCasters.length !== 0) {

            return (
                <ResetButtonWrapper>
                    <ResetButton onClick={() => this.setState({highlightedCasters: []})} href='#'>Show all</ResetButton>
                </ResetButtonWrapper>
            );
        }
    }

    render() {

        return (
            <>
                <Wrapper>
                    <Header>
                        <h1>
                            The Spells of D&D 5e
                        </h1>
                        <h3>
                            {this.state.highlightedCasters.length === 0 ? 'Click on a spell to highlight its casters 🡢 ' : 'Spells known by '}{this.renderTitleCasterLabels()}{this.renderResetButton()}{this.renderButtons()}
                        </h3>
                    </Header>
                    <BoardWrapper>
                        <Board>
                            {this.renderSpells()}
                        </Board>
                    </BoardWrapper>
                    <Aside>
                        <h2>What is this thing?</h2>
                        <p>Ever wondered how big of an overlap there is between the spells of different casters in DnD? Do you want to know how similar the classes are? Do you like looking at trippy abstract modern art? Then this graphic is for you.</p>
                        <p>I took all 361 spells in the PHB, put them on a grid, colored them according to their caster classes, then meticulously arranged them by hand to form clusters as tight as possible.</p>
                        <p>If you enjoyed this, or found it useful, you can <a href='https://ko-fi.com/B0B511KTL'>buy me a coffee on Ko-Fi!</a></p>
                        <ColumnBreakerH2>Will you include spells from other sources (DMG, SCAG, XGE, AI)?</ColumnBreakerH2>
                        <p>Yeah! Maybe. It's, uh, a lot of work, so it will probably take time.</p>
                        <h2>How did you make this?</h2>
                        <p>I used <a href="https://www.reddit.com/r/DnD/comments/2qs89e/5e_spell_reference_sheets_are_done/">u/Zolo49's spell spreadsheet</a> as a resource, made a JSON file out of it, displayed them on a CSS grid, and used React to create an editing interface that I used to order the spells into these positions.</p>
                        <Logo>
                            <a href="http://github.com/dukeflipchart">
                                <img src={avatar} />
                            </a>
                        </Logo>
                    </Aside>
                </Wrapper>
            </>
        );
    }
}

export default App;
