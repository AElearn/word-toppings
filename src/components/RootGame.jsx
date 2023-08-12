import { Button, Form, ListGroup } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import AlertDismissible from "./AlertDismissible";
import wordsData from "../words.json";

const RootGame = (props) => {
	const { lesson, setStage } = props;

	const [showAlert, setShowAlert] = useState(false);
	const [alertWord, setAlertWord] = useState("");
	const [rootWord, setRootWord] = useState(wordsData.roots[lesson].root);
	const [guesses, setGuesses] = useState([]);
	const [answers, setAnswers] = useState(
		wordsData.roots[lesson].words.map((e) => e.word)
	);
	const [answersInfo, setAnswersInfo] = useState(wordsData.roots[lesson].words);
	const [text, setText] = useState("");

	const startNewGame = (word) => {
		setRootWord(word);
		setGuesses([]);
		setAnswers(
			wordsData.roots
				.find((e) => e.root.toUpperCase() === word.toUpperCase())
				.words.map((e) => e.word)
		);
		setAnswersInfo(
			wordsData.roots.find((e) => e.root.toUpperCase() === word.toUpperCase())
				.words
		);
		setText("");
	};
	const onSubmit = () => {
		const newGuess = text.toUpperCase();
		if (
			answers.find((word) => word.toUpperCase() === newGuess) &&
			!guesses.find((word) => word.toUpperCase() === newGuess)
		) {
			guesses.unshift(formattedWord(newGuess));
			setText("");
		}
	};

	const formattedWord = (word) => {
		if (!word) {
			return "";
		}
		return word[0].toUpperCase() + word.substring(1).toLowerCase();
	};

	const checkKeyPress = (e) => {
		const { keyCode } = e;
		if (keyCode === 13) {
			onSubmit();
		}
	};

	return (
		<>
			<AlertDismissible
				showAlert={showAlert}
				setShowAlert={setShowAlert}
				word={formattedWord(alertWord)}
				prefix={
					answersInfo.find(
						(e) => e.word.toUpperCase() === alertWord.toUpperCase()
					)?.prefix
				}
				prefixDef={
					wordsData.prefixes.find(
						(t) =>
							t.prefix ===
							answersInfo.find(
								(e) => e.word.toUpperCase() === alertWord.toUpperCase()
							)?.prefix
					)?.definition
				}
				suffix={
					answersInfo.find(
						(e) => e.word.toUpperCase() === alertWord.toUpperCase()
					)?.suffix
				}
				suffixDef={
					wordsData.suffixes.find(
						(t) =>
							t.suffix ===
							answersInfo.find(
								(e) => e.word.toUpperCase() === alertWord.toUpperCase()
							)?.suffix
					)?.definition
				}
			/>
			<div className="text-center">
				<br />
				<span>The base/root word is:</span>
				<h1 className="red">{formattedWord(rootWord)}</h1>
				<Form.Control
					placeholder="Type here"
					className="align-middle d-inline-flex p-2"
					style={{ maxWidth: "170px" }}
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={checkKeyPress}
				/>{" "}
				<Button
					className="align-middle d-inline-flex p-2"
					onClick={() => onSubmit()}
				>
					Submit
				</Button>
				<br /> <br />
				<span>
					You've found {guesses.length} out of {answers.length} words.
				</span>
				{guesses.length == answers.length && (
					<>
						<br />
						<Button variant="success" onClick={() => setStage(2)}>
							NEXT STAGE
						</Button>
					</>
				)}
				<br /> <br />
				<ListGroup>
					{answersInfo.map((answer) => {
						if (guesses.find((guess) => guess === answer.word)) {
							return (
								<ListGroup.Item
									className="list-group-item-info"
									key={answer.word}
									onClick={() => {
										setAlertWord(answer.word);
										setShowAlert(true);
									}}
								>
									{answer.word}
								</ListGroup.Item>
							);
						} else {
							const baseIndex = answer.word.indexOf(answer.base);
							const hint = `${"_ ".repeat(baseIndex)}${
								answer.base
							}${" _".repeat(
								answer.word.length - baseIndex - answer.base.length
							)}`;
							return (
								<ListGroup.Item
									className="list-group-item-light"
									key={answer.word}
								>
									{hint}
								</ListGroup.Item>
							);
						}
					})}
				</ListGroup>
			</div>
		</>
	);
};

export default RootGame;
