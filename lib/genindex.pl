use strict;
use warnings;
use Data::Dumper;

my @ignorePatterns = (
	qr(thirdparty)
);

my $indexFileName = 'index.js';

my %exportList = ();

&doList(\%exportList, './', './');
#print Dumper(%exportList);
open OFH, '>' . $indexFileName or die "Can't write $indexFileName.\n";
foreach my $name (sort keys %exportList) {
	my $value = $exportList{$name};
	print OFH "export { $value->{export} } from '$value->{file}';\n";
}
close OFH;

sub doList
{
	my ($result, $path, $prefix) = @_;
	
	my @files = glob($path . '*');
	
	foreach my $file (@files) {
		my $ignore = 0;
		foreach my $pattern (@ignorePatterns) {
			if($file =~ $pattern) {
				$ignore = 1;
				last;
			}
		}
		
		next if $ignore;
		
		if(-d $file) {
			&doList($result, $file . '/', $file . '/');
		}
		elsif($file =~ /\.js$/i) {
			&doParseFile($result, $file);
		}
	}
}

sub doParseFile
{
	my ($result, $fileName) = @_;
	
	open FH, '<' . $fileName or die "Can't read $fileName.\n";
	while(my $line = <FH>) {
		if($line =~ /^\s*export\s+.*from/) {
			next;
		}
		if($line =~ /^\s*export\s+default\s+(\w+)\s*;\s*$/) {
			my $name = $1;
			$result->{$name} = {
				export => 'default as ' . $name,
				file => $fileName
			};
			next;
		}
		if($line =~ /^\s*export\s*{\s*(\w+)\s*}\s*;\s*$/) {
			my $name = $1;
			$result->{$name} = {
				export => $name,
				file => $fileName
			};
			next;
		}
		if($line =~ /^\s*export\s+(function|let|const)\s+(\w+)/) {
			my $name = $2;
			$result->{$name} = {
				export => $name,
				file => $fileName
			};
			next;
		}
	}
	close FH;
}

