import * as React from 'react';
import TextBox from './TextBox';
import FileComparison from './FileComparison';
import { CalculatorContainer, DottedDivider } from './Calculator.style';
import useCalculation from '../hooks/useCalculation';
import { useStateValue } from '../state/state';
import useFileComparisons from '../hooks/useFileComparisons';

export interface FileComparison {
	fileIcon: JSX.Element;
	comparisonText: string;
}

export default function Calculator(): JSX.Element {
	const [{ unitBoxes }] = useStateValue();

	useCalculation();

	const fileComparisons = useFileComparisons(unitBoxes.bytes);

	return (
		<CalculatorContainer>
			<TextBox field={'fiat'}></TextBox>
			<TextBox field={'bytes'}></TextBox>
			<DottedDivider>
				{fileComparisons.map((fileComparison) => (
					<FileComparison
						key={fileComparison[1][1]}
						fileIcon={fileComparison[0]}
						comparisonText={fileComparison[1]}
					/>
				))}
			</DottedDivider>
			<TextBox field={'ar'}></TextBox>
		</CalculatorContainer>
	);
}
