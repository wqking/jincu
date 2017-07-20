class TestCase
{
	constructor()
	{
		this._testBed = null;
	}
	
	getTestBed()
	{
		return this._testBed;
	}

	getScene()
	{
		return this.getTestBed().getScene();
	}

	initialize(testBed)
	{
		this._testBed = testBed;

		this.doInitialize();
	}

	finalize()
	{
		this.doFinalize();
	}

	doInitialize()
	{
	}

	doFinalize()
	{
	}

}

export { TestCase };
