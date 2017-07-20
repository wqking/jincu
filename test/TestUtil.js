class TestUtil
{
	static almostEqual(a, b)
	{
		return Math.abs(a - b) < 1.0;
	}

}

export { TestUtil };
