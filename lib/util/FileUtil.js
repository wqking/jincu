class FileUtil
{
	static removeExt(fileName)
	{
		const index = fileName.lastIndexOf('.');
		if(index >= 0) {
			fileName = fileName.substring(0, index);
		}
		return fileName;
	}
	
	static replaceExt(fileName, ext)
	{
		return FileUtil.removeExt(fileName) + ext;
	}

}

export { FileUtil };
