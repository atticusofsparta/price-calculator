import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { SinonStubbedInstance, stub } from 'sinon';
import { TokenFiatPair, TokenFiatRate } from './token_fiat_price';
import { CoinGeckoTokenToFiatOracle, Fetcher, JSFetcher } from './coingecko_token_to_fiat_oracle';
import type { FiatID, TokenID } from './fiat_oracle_types';

chai.use(chaiAsPromised);

const token: TokenID = 'arweave';
const fiat: FiatID = 'usd';
const myTestingPair = new TokenFiatPair(token, fiat);
const examplePriceValue = 15.05;

const coingeckoResponseSample = `{
	"${token}": {
		"${fiat}": ${examplePriceValue}
	}
}`;

const myCustomResponse: Response = {
	async json(): Promise<string> {
		return JSON.parse(coingeckoResponseSample);
	}
} as Response;

describe('The CoinGeckoTokenToFiatOracle class', () => {
	let stubbedFetcher: SinonStubbedInstance<Fetcher>;
	let coingeckoOracle: CoinGeckoTokenToFiatOracle;

	beforeEach(() => {
		stubbedFetcher = stub(new JSFetcher());
		stubbedFetcher.fetch.callsFake(async () => myCustomResponse);
		coingeckoOracle = new CoinGeckoTokenToFiatOracle(stubbedFetcher);
	});

	it('does not perform a fetch when oracle is initialized', () => {
		expect(stubbedFetcher.fetch.callCount).to.equal(0);
	});

	describe('getQueryRequestUrl function', () => {
		it('generates the correct URL', async () => {
			expect(coingeckoOracle.getQueryRequestUrl('arweave', ['usd', 'btc'])).to.equal(
				'https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd%2Cbtc'
			);
		});

		it('throws an error when no fiats are provided', async () => {
			expect(() => coingeckoOracle.getQueryRequestUrl('arweave', [])).to.throw(Error);
		});
	});

	describe('getFiatRatesForToken function', () => {
		it('returns the expected response after a single fetch', async () => {
			expect(await coingeckoOracle.getFiatRatesForToken(token, [fiat])).to.deep.equal([
				new TokenFiatRate(token, fiat, examplePriceValue)
			]);
			expect(stubbedFetcher.fetch.callCount).to.equal(1);
		});

		it('throws an error when no fiats are provided', async () => {
			expect(coingeckoOracle.getFiatRatesForToken(token, [])).to.be.rejectedWith(Error);
			expect(stubbedFetcher.fetch.callCount).to.equal(0);
		});
	});

	describe('getPriceForFiatTokenPair function', () => {
		it('returns the expected response after a single fetch', async () => {
			expect(await coingeckoOracle.getPriceForFiatTokenPair(new TokenFiatPair(token, fiat))).to.deep.equal(
				new TokenFiatRate(token, fiat, examplePriceValue)
			);
			expect(stubbedFetcher.fetch.callCount).to.equal(1);
		});
	});
});
